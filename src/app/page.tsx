"use client";
import { useEffect, useState, useMemo } from "react";

interface Server {
  id: number;
  name: string;
  url: string;
  type: string;
}

interface ServerStatus {
  status: string;
  loading: boolean;
}

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [search, setSearch] = useState("");
  const [serverStatuses, setServerStatuses] = useState<Record<number, ServerStatus>>({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [globalSpeed, setGlobalSpeed] = useState<number | null>(null);
  const [bdixSpeed, setBdixSpeed] = useState<number | null>(null);
  const [loadingGlobalSpeed, setLoadingGlobalSpeed] = useState(false);
  const [loadingBdixSpeed, setLoadingBdixSpeed] = useState(false);

  useEffect(() => {
    fetch("/servers.json")
      .then((res) => res.json())
      .then((data) => setServers(data));
  }, []);

  const checkServerStatus = async (server: Server) => {
    setServerStatuses((prev) => ({ ...prev, [server.id]: { status: "Testing...", loading: true } }));
    try {
      const response = await fetch(`/api/check-server?url=${encodeURIComponent(server.url)}`);
      const data = await response.json();
      setServerStatuses((prev) => ({ ...prev, [server.id]: { status: data.status, loading: false } }));
    } catch (error) {
      console.error("Error checking server:", error);
      setServerStatuses((prev) => ({ ...prev, [server.id]: { status: "Error", loading: false } }));
    }
  };

  const testAllServers = async () => {
    setLoadingAll(true);
    for (const server of servers) {
      await checkServerStatus(server);
    }
    setLoadingAll(false);
  };

  const runSpeedTest = async (type: "global" | "bdix") => {
    const setLoading = type === "global" ? setLoadingGlobalSpeed : setLoadingBdixSpeed;
    const setSpeed = type === "global" ? setGlobalSpeed : setBdixSpeed;

    setLoading(true);
    setSpeed(null);

    const fileSize = 10000000; // 10 MB
    const startTime = new Date().getTime();

    try {
      const response = await fetch(`/api/speed-test?size=${fileSize}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.blob(); // Download the file

      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000; // seconds
      const bitsLoaded = fileSize * 8; // bits
      const speedMbps = (bitsLoaded / duration / 1000000).toFixed(2);
      setSpeed(parseFloat(speedMbps));
    } catch (error) {
      console.error(`Error during ${type} speed test:`, error);
      setSpeed(0); // Indicate an error
    } finally {
      setLoading(false);
    }
  };

  const filteredServers = useMemo(() => {
    return servers.filter((server) =>
      server.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [servers, search]);

  const categorizedServers = useMemo(() => {
    return filteredServers.reduce((acc, server) => {
      if (!acc[server.type]) {
        acc[server.type] = [];
      }
      acc[server.type].push(server);
      return acc;
    }, {} as Record<string, Server[]>);
  }, [filteredServers]);

  return (
    <div className="font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">BDIX Server & Speed Tester</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test BDIX server reachability and internet speed.
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search for a server..."
            className="flex-grow p-4 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={testAllServers}
            disabled={loadingAll}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAll ? "Testing All..." : "Test All Servers"}
          </button>
        </div>

        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4">Internet Speed Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <button
                onClick={() => runSpeedTest("global")}
                disabled={loadingGlobalSpeed}
                className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingGlobalSpeed ? "Testing Global Speed..." : "Test Global Speed"}
              </button>
              {globalSpeed !== null && (
                <p className="mt-2 text-lg text-center">
                  Global Speed: <span className="font-bold">{globalSpeed} Mbps</span>
                </p>
              )}
            </div>
            <div>
              <button
                onClick={() => runSpeedTest("bdix")}
                disabled={loadingBdixSpeed}
                className="w-full px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingBdixSpeed ? "Testing BDIX Speed..." : "Test BDIX Speed"}
              </button>
              {bdixSpeed !== null && (
                <p className="mt-2 text-lg text-center">
                  BDIX Speed: <span className="font-bold">{bdixSpeed} Mbps</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {Object.keys(categorizedServers).map((type) => (
          <div key={type} className="mb-8">
            <h2 className="text-3xl font-bold mb-6 capitalize">{type} Servers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categorizedServers[type].map((server) => (
                <div
                  key={server.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{server.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Type: {server.type}</p>
                    <p className={`text-md font-medium ${serverStatuses[server.id]?.status === "Working" ? "text-green-500" : serverStatuses[server.id]?.status === "Not Working" ? "text-red-500" : "text-yellow-500"}`}>
                      Status: {serverStatuses[server.id]?.status || "Not Tested"}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <a
                      href={server.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow text-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 text-sm"
                    >
                      Open Server
                    </a>
                    <button
                      onClick={() => checkServerStatus(server)}
                      disabled={serverStatuses[server.id]?.loading}
                      className="flex-grow px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {serverStatuses[server.id]?.loading ? "Testing..." : "Test"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}