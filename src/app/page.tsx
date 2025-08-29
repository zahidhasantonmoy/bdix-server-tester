"use client";
import { useEffect, useState, useMemo } from "react";
import useServerTester from "../hooks/useServerTester";

interface Server {
  id: number;
  name: string;
  addresses: string[];
  type: string;
}

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetch("/servers.json")
      .then((res) => res.json())
      .then((data) => setServers(data.servers));
  }, []);

  const { testResults, isTesting, startTesting } = useServerTester(servers);

  const filteredServers = useMemo(() => {
    return servers.filter((server) => {
      const matchesSearch = server.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || server.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [servers, search, selectedCategory]);

  const handleStartTest = () => {
    startTesting(5); // Default concurrency limit
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">BDIX Server Test</h1>
          <p className="text-lg text-gray-600">With this tool, you can easily find all open BDIX servers</p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-screen-lg">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <div id="percent" className="mb-5">
                <div id="progress">
                  <svg viewBox="0 0 110 100" className="h-40vh mx-auto block -mt-10">
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%">
                      <stop offset="0%" stopColor="#48c78e"></stop>
                      <stop offset="100%" stopColor="#48c78e"></stop>
                    </linearGradient>
                    <path className="stroke-gray-300 stroke-linecap-round stroke-width-6" d="M30,90 A40,40 0 1,1 80,90" fill="none"></path>
                    <path id="blue" fill="none" className="stroke-blue-600 stroke-linecap-round stroke-width-6" d="M30,90 A40,40 0 1,1 80,90" style={{ strokeDashoffset: 0 }}></path>
                    <text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" className="text-base" id="current">{testResults.filter(r => r.status !== 'testing').length}/{servers.length}</text>
                  </svg>
                </div>
              </div>
              <button
                onClick={handleStartTest}
                disabled={isTesting}
                className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? "Testing..." : "Test server again"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <div className="flex-grow flex flex-wrap gap-2">
                <button className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={() => setSelectedCategory("All")}>Show all <strong>{servers.length}</strong></button>
                <button className="px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600" onClick={() => setSelectedCategory("Online")}>Open <strong>{testResults.filter(r => r.status === 'online').length}</strong></button>
                <button className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600" onClick={() => setSelectedCategory("Offline")}>Closed <strong>{testResults.filter(r => r.status === 'offline').length}</strong></button>
                <button className="px-3 py-1 text-sm rounded-md bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => setSelectedCategory("Testing")}>Testing <strong>{testResults.filter(r => r.status === 'testing').length}</strong></button>
              </div>
              <div className="w-full sm:w-1/4 mt-4 sm:mt-0">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Site Name</th>
                  <th className="px-4 py-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Site Type</th>
                  <th className="px-4 py-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Last Checked</th>
                  <th className="px-4 py-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredServers.map((server) => {
                  const result = testResults.find((r) => r.id === server.id);
                  const statusColorClass =
                    result?.status === "online"
                      ? "text-green-500"
                      : result?.status === "offline"
                      ? "text-red-500"
                      : "text-yellow-500";
                  const statusText =
                    result?.status === "online"
                      ? "Open"
                      : result?.status === "offline"
                      ? "Closed"
                      : "Testing";

                  return (
                    <tr key={server.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{server.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 hidden sm:table-cell">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{server.type}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 hidden sm:table-cell">
                        {new Date().toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <span className={`flex items-center ${statusColorClass}`}>
                          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: statusColorClass === 'text-green-500' ? '#48c78e' : statusColorClass === 'text-red-500' ? '#f14668' : '#ffe08a' }}></span>
                          {statusText}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <a
                          href={server.addresses[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}