"use client";

import { useState, useEffect } from "react";
import { Post } from "../../type";
import Link from "next/link";
import { useParams } from "next/navigation";
import AddPostForm from "../../component/AddPostForm";

interface LocalPost extends Post {
  createdAt?: string;
}

export default function UserPostsPage() {
  const params = useParams<{ id: string }>();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  const parsedUserId = Number(userId);

  const [posts, setPosts] = useState<Post[]>([]);
  const [apiIsLoading, setApiIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    if (!userId) return;
    fetchPosts(userId);
  }, [userId]);

  const fetchPosts = async (id: string) => {
    try {
      setApiIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const apiPosts: Post[] = await response.json();

      let allLocalPosts: LocalPost[] = [];
      const localPostsRaw = localStorage.getItem("newPosts");

      if (localPostsRaw) {
        try {
          allLocalPosts = JSON.parse(localPostsRaw);
        } catch {
          allLocalPosts = [];
        }
      }

      const localPostsForUser = allLocalPosts.filter(
        (post) => post.userId === Number(id),
      );

      // local posts first, then API posts
      setPosts([...localPostsForUser, ...apiPosts]);
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setApiIsLoading(false);
    }
  };

  const handlePostAdded = () => {
    if (!userId) return;
    fetchPosts(userId);
  };

  if (apiIsLoading) {
    return <div style={{ padding: 20 }}>Loading posts...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  const safeTotalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((previousPage) => Math.max(previousPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((previousPage) =>
      Math.min(previousPage + 1, safeTotalPages),
    );
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: 20 }}>
      <Link href="/">
        <button style={{ marginBottom: 20 }}>← Back to Users</button>
      </Link>

      <h1>User Posts</h1>

      <AddPostForm userId={parsedUserId} onPostAdded={handlePostAdded} />

      <p style={{ marginBottom: 20 }}>
        Showing {posts.length} posts (Page {currentPage} of {safeTotalPages})
      </p>

      <div>
        {paginatedPosts.map((post) => (
          <div
            key={post.id}
            style={{
              padding: 20,
              marginBottom: 15,
              borderRadius: 8,
              border: "1px solid black",
            }}
          >
            <h3>{post.title}</h3>
            <p style={{ marginTop: 10 }}>{post.body}</p>
          </div>
        ))}
      </div>

      {safeTotalPages > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 20,
            flexWrap: "wrap",
          }}
        >
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>

          {Array.from({ length: safeTotalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                style={{
                  fontWeight: pageNumber === currentPage ? "bold" : "normal",
                  textDecoration:
                    pageNumber === currentPage ? "underline" : "none",
                }}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={goToNextPage}
            disabled={currentPage === safeTotalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
