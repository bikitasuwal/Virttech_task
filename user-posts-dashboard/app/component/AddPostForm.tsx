"use client";

import { useState } from "react";
import { z } from "zod";

const addPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  body: z.string().trim().min(1, "Body is required"),
});

type AddPostFormData = z.infer<typeof addPostSchema>;

type AddPostFormErrors = {
  title: string;
  body: string;
};

interface AddPostFormProps {
  userId: number;
  onPostAdded: () => void;
}

export default function AddPostForm({ userId, onPostAdded }: AddPostFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<AddPostFormErrors>({
    title: "",
    body: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = addPostSchema.safeParse({ title, body });

    if (!validationResult.success) {
      const nextErrors: AddPostFormErrors = { title: "", body: "" };

      for (const issue of validationResult.error.issues) {
        if (issue.path[0] === "title") {
          nextErrors.title = issue.message;
        }

        if (issue.path[0] === "body") {
          nextErrors.body = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({ title: "", body: "" });

    const formData: AddPostFormData = validationResult.data;

    let existingPosts: Array<
      AddPostFormData & { id: number; userId: number; createdAt: string }
    > = [];
    const rawLocalPosts = localStorage.getItem("newPosts");

    if (rawLocalPosts) {
      try {
        existingPosts = JSON.parse(rawLocalPosts);
      } catch {
        existingPosts = [];
      }
    }

    // Create new post
    const newPost = {
      id: Date.now(),
      title: formData.title,
      body: formData.body,
      userId,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const updatedPosts = [...existingPosts, newPost];
    localStorage.setItem("newPosts", JSON.stringify(updatedPosts));

    setTitle("");
    setBody("");
    setErrors({ title: "", body: "" });

    console.log("Post added successfully!");
    onPostAdded();
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid black",
      }}
    >
      <h2>Add New Post</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              border: errors.title ? "1px solid red" : "1px solid black",
              borderRadius: "5px",
            }}
          />
          {errors.title && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.title}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            style={{
              padding: "10px",
              width: "100%",
              border: errors.body ? "1px solid red" : "1px solid black",
              borderRadius: "5px",
              fontFamily: "Arial, sans-serif",
            }}
          />
          {errors.body && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.body}
            </span>
          )}
        </div>

        <button type="submit">Add Post</button>
      </form>
    </div>
  );
}
