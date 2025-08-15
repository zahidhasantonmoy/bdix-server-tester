"use client";
import { useEffect, useState } from "react";

interface Server {
  id: number;
  name: string;
  url: string;
  type: string;
}

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/servers.json")
      .then((res) => res.json())
      .then((data) => setServers(data));
  }, []);

  const filteredServers = servers.filter((server) =>
    server.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans bg-[var(--background)] text-[var(--foreground)] min-h-screen transition-colors duration-500">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)]">BDIX Server List</h1>
          <p className="text-lg text-[var(--foreground-muted)]">
            A list of BDIX hosted servers.
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for a server..."
            className="w-full p-4 rounded-lg bg-[var(--background-light)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-300 text-[var(--foreground)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredServers.map((server) => (
            <div
              key={server.id}
              className="bg-[var(--card-background)] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <h2 className="text-2xl font-semibold mb-2 text-[var(--foreground)]">{server.name}</h2>
              <a
                href={server.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Go to Server
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
