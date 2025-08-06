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
  speed: number | null; // in Mbps
  timestamp: string;
}

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testingAll, setTestingAll] = useState<boolean>(false);
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

  const testServer = async (serverUrl: string): Promise<TestResult> => {
    const startTime = performance.now();
    let status = 'Error';
    let latency: number | null = null;
    let speed: number | null = null;

    try {
      // Latency test (HEAD request)
      const latencyResponse = await fetch(serverUrl, { method: 'HEAD', mode: 'no-cors' });
      const latencyEndTime = performance.now();
      latency = latencyEndTime - startTime;
      status = latencyResponse.ok ? 'Success' : 'Failed';

      // Speed test (download a small file)
      if (latencyResponse.ok) {
        const speedTestStartTime = performance.now();
        const speedTestResponse = await fetch(`${serverUrl}/testfile.bin?cachebust=${Date.now()}`); // Use a small, known file
        if (speedTestResponse.ok) {
          const blob = await speedTestResponse.blob();
          const speedTestEndTime = performance.now();
          const durationSeconds = (speedTestEndTime - speedTestStartTime) / 1000;
          const fileSizeBits = blob.size * 8; // Convert bytes to bits
          speed = (fileSizeBits / (1024 * 1024)) / durationSeconds; // Mbps
        }
      }
    } catch (e) {
      const endTime = performance.now();
      latency = endTime - startTime;
      status = 'Error';
    }

    return {
      url: serverUrl,
      status: status,
      latency: latency,
      speed: speed,
      timestamp: new Date().toLocaleString(),
    };
  };

  const handleTest = async () => {
    if (!selectedServer) return;
    setTestingAll(true); // Disable buttons during single test too
    const result = await testServer(selectedServer);
    setTestResults((prevResults) => [result, ...prevResults]);
    setTestingAll(false);
  };

  const handleTestAll = async () => {
    setTestingAll(true);
    setTestResults([]); // Clear previous results
    for (const server of servers) {
      const result = await testServer(server.url);
      setTestResults((prevResults) => [result, ...prevResults]);
    }
    setTestingAll(false);
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
        <div className="flex space-x-4">
          <button
            onClick={handleTest}
            className="flex-1 bg-white text-purple-700 font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={testingAll}
          >
            Test Selected Server
          </button>
          <button
            onClick={handleTestAll}
            className="flex-1 bg-white text-purple-700 font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={testingAll}
          >
            {testingAll ? 'Testing All...' : 'Test All Servers'}
          </button>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg w-full max-w-md mt-8">
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          <ul className="space-y-2">
            {testResults.map((result, index) => (
              <li key={index} className="bg-white bg-opacity-30 p-3 rounded-md">
                <p><strong>URL:</strong> {result.url}</p>
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Latency:</strong> {result.latency ? `${result.latency.toFixed(2)} ms` : 'N/A'}</p>
                <p><strong>Speed:</strong> {result.speed ? `${result.speed.toFixed(2)} Mbps` : 'N/A'}</p>
                <p><strong>Timestamp:</strong> {result.timestamp}</p>
                {result.status === 'Success' && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 hover:underline mt-2 inline-block"
                  >
                    Open in New Tab
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {testResults.filter(result => result.status === 'Success').length > 0 && (
        <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg w-full max-w-md mt-8">
          <h2 className="text-2xl font-bold mb-4">Working Servers</h2>
          <ul className="space-y-2">
            {testResults.filter(result => result.status === 'Success').map((result, index) => (
              <li key={index} className="bg-white bg-opacity-30 p-3 rounded-md">
                <p><strong>URL:</strong> {result.url}</p>
                <p><strong>Latency:</strong> {result.latency ? `${result.latency.toFixed(2)} ms` : 'N/A'}</p>
                <p><strong>Speed:</strong> {result.speed ? `${result.speed.toFixed(2)} Mbps` : 'N/A'}</p>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 hover:underline mt-2 inline-block"
                >
                  Open in New Tab
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

