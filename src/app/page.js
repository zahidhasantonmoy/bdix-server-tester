"use client";

import { useState, useEffect } from 'react';

const bdixServers = [
  { name: 'Sam Online', url: 'http://10.16.100.244/' },
  { name: 'CTG Movies', url: 'http://10.16.100.244/' },
  { name: 'ICC FTP', url: 'http://10.16.100.244/' },
  { name: 'Discovery FTP', url: 'http://10.16.100.244/' },
];

export default function Home() {
  const [serverStatus, setServerStatus] = useState({});

  useEffect(() => {
    const checkServer = async (server) => {
      try {
        // We use 'no-cors' mode to avoid CORS issues.
        // This means we won't be able to read the response body,
        // but we can still check if the server is reachable.
        await fetch(server.url, { mode: 'no-cors', timeout: 5000 });
        setServerStatus((prevStatus) => ({
          ...prevStatus,
          [server.name]: 'Online',
        }));
      } catch (error) {
        setServerStatus((prevStatus) => ({
          ...prevStatus,
          [server.name]: 'Offline',
        }));
      }
    };

    bdixServers.forEach((server) => {
      setServerStatus((prevStatus) => ({
        ...prevStatus,
        [server.name]: 'Checking...',
      }));
      checkServer(server);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">BDIX Connectivity Tester</h1>
      </header>
      <main className="p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4">
          <ul>
            {bdixServers.map((server) => (
              <li key={server.name} className="flex justify-between items-center p-2 border-b">
                <span>{server.name}</span>
                <span
                  className={`px-2 py-1 text-sm font-semibold rounded-full ${
                    serverStatus[server.name] === 'Online'
                      ? 'bg-green-500 text-white'
                      : serverStatus[server.name] === 'Offline'
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {serverStatus[server.name] || 'Checking...'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}