"use client";
import { useEffect, useState, useMemo } from "react"; // Added useMemo
import useServerTester from "../hooks/useServerTester";

interface Server {
  id: number;
  name: string;
  url: string;
  type: string;
}

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All"); // New state for category

  useEffect(() => {
    fetch("/servers.json")
      .then((res) => res.json())
      .then((data) => setServers(data));
  }, []);

  const { testResults, isTesting, startTesting, resetTesting } = useServerTester(servers);

  // Get unique categories from servers
  const categories = useMemo(() => {
    const uniqueCategories = new Set(servers.map(server => server.type));
    return ["All", ...Array.from(uniqueCategories)];
  }, [servers]);

  const filteredServers = useMemo(() => {
    return servers.filter((server) => {
      const matchesSearch = server.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || server.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [servers, search, selectedCategory]);


  return (
    <div className="font-sans bg-[var(--background)] text-[var(--foreground)] min-h-screen transition-colors duration-500">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)]">BDIX Server List</h1>
          <p className="text-lg text-[var(--foreground-muted)]">
            A list of BDIX hosted servers.
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search for a server..."
            className="flex-grow p-4 rounded-lg bg-[var(--background-light)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-300 text-[var(--foreground)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={startTesting}
            disabled={isTesting}
            className="px-6 py-3 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-opacity-80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? "Testing..." : "Start Test"}
          </button>
          <button
            onClick={resetTesting}
            disabled={isTesting}
            className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-opacity-80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Restart Test
          </button>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                ${selectedCategory === category
                  ? "bg-[var(--accent)] text-black"
                  : "bg-[var(--background-light)] text-[var(--foreground)] hover:bg-[var(--border-color)]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredServers.map((server) => {
            const result = testResults.find((r) => r.id === server.id);
            const statusColor =
              result?.status === "online"
                ? "text-green-500"
                : result?.status === "offline"
                ? "text-red-500"
                : "text-yellow-500";
            const statusText =
              result?.status === "online"
                ? "Online"
                : result?.status === "offline"
                ? "Offline"
                : "Testing...";

            return (
              <div
                key={server.id}
                className="bg-[var(--card-background)] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <h2 className="text-2xl font-semibold mb-2 text-[var(--foreground)]">{server.name}</h2>
                <p className={`text-sm ${statusColor} mb-2`}>
                  Status: {statusText} {result?.responseTime ? `(${result.responseTime}ms)` : ""}
                </p>
                <a
                  href={server.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  Go to Server
                </a>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
