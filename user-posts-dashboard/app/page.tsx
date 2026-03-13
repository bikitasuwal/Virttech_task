"use client";

import { useEffect, useState } from "react";
import type { User } from "./type";

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [apiIsLoading, setApiIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setApiIsLoading(true);
        setError(null);
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (e) {
        setError("Something went wrong");
      } finally {
        setApiIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (apiIsLoading) return <div style={{ padding: 20 }}>Loading users...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Users</h1>
      <div>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid black",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16
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
          </div>
        ))}
      </div>
    </main>
  );
}
