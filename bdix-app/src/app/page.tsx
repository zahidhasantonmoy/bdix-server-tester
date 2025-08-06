'use client';

import { useState, useEffect } from 'react';

interface Server {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface TestResult {
  url: string;
  status: string;
  latency: number | null;
  timestamp: string;
}

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/servers.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Server[] = await response.json();
        setServers(data);
        if (data.length > 0) {
          setSelectedServer(data[0].url);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const handleTest = async () => {
    if (!selectedServer) return;

    const startTime = performance.now();
    try {
      const response = await fetch(selectedServer, { method: 'HEAD', mode: 'no-cors' });
      const endTime = performance.now();
      const latency = endTime - startTime;

      setTestResults((prevResults) => [
        {
          url: selectedServer,
          status: response.ok ? 'Success' : 'Failed',
          latency: latency,
          timestamp: new Date().toLocaleString(),
        },
        ...prevResults,
      ]);
    } catch (e: any) {
      const endTime = performance.now();
      const latency = endTime - startTime;
      setTestResults((prevResults) => [
        {
          url: selectedServer,
          status: 'Error',
          latency: latency,
          timestamp: new Date().toLocaleString(),
        },
        ...prevResults,
      ]);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-500 to-purple-600 text-white">Loading servers...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-500 to-purple-600 text-white">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-500 to-purple-600 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">BDIX Server Tester</h1>

      <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg mb-8 w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="server-select" className="block text-lg font-medium mb-2">
            Select a BDIX Server:
          </label>
          <select
            id="server-select"
            className="w-full p-2 rounded bg-white bg-opacity-30 text-white border border-white border-opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
            value={selectedServer}
            onChange={(e) => setSelectedServer(e.target.value)}
          >
            {servers.map((server) => (
              <option key={server.id} value={server.url} className="text-gray-900">
                {server.name} ({server.type.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleTest}
          className="w-full bg-white text-purple-700 font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300"
        >
          Test Server
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          <ul className="space-y-2">
            {testResults.map((result, index) => (
              <li key={index} className="bg-white bg-opacity-30 p-3 rounded-md">
                <p><strong>URL:</strong> {result.url}</p>
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Latency:</strong> {result.latency ? `${result.latency.toFixed(2)} ms` : 'N/A'}</p>
                <p><strong>Timestamp:</strong> {result.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

