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
    <div className="font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">BDIX Server List</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A list of BDIX hosted servers.
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for a server..."
            className="w-full p-4 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredServers.map((server) => (
            <div
              key={server.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold mb-2">{server.name}</h2>
              <a
                href={server.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
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