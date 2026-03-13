"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Post } from "../../type";
import Link from "next/link";

export default function UserPostsPage() {
  const params = useParams<{ id: string }>();
  const userId = params.id;

  const [posts, setPosts] = useState<Post[]>([]);
  const [apiIsLoading, setApiIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchPosts = async () => {
      try {
        setApiIsLoading(true);
        setError(null);
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
        );
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: Post[] = await res.json();
        setPosts(data);
      } catch {
        setError("Something went wrong");
      } finally {
        setApiIsLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (apiIsLoading) return <div style={{ padding: 20 }}>Loading posts...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <main style={{ padding: 20 }}>
      <Link href="/">
        <button style={{ marginBottom: 20 }}>← Back</button>
      </Link>

      <h1>Posts of User {userId}</h1>
      <p style={{ marginTop: 10, marginBottom: 20 }}>
        Showing {posts.length} posts
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid black",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ fontWeight: 700 }}>{post.title}</div>
            <p style={{ marginTop: 8 }}>{post.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
