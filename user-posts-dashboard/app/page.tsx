"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "./type";

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [apiIsLoading, setApiIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setApiIsLoading(true);
        setError(null);
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();
        setUsers(data);
      } catch {
        setError("Something went wrong");
      } finally {
        setApiIsLoading(false);
      }
    };

    fetchUsers();
  }, []);
  if (apiIsLoading) return <div style={{ padding: 20 }}>Loading users...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  const searchLower = searchTerm.toLowerCase();
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main style={{ padding: 20 }}>
      <h1>Users</h1>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: 10,
            width: "100%",
            maxWidth: 420,
            border: "1px solid black",
            borderRadius: 6,
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filteredUsers.length === 0 ? (
          <p>No users found</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              style={{
                border: "1px solid black",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div>
                <b>Name:</b> {user.name}
              </div>
              <div>
                <b>Email:</b> {user.email}
              </div>
              <div>
                <b>Company:</b> {user.company.name}
              </div>

              <div style={{ marginTop: 12 }}>
                <Link href={`/users/${user.id}`}>
                  <button>View Posts</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
