"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

interface Server {
  id: number;
  name: string;
  url: string;
  type: string;
}

interface ServerStatus {
  status: "Working" | "Not Working" | "Testing..." | "Error" | "Not Tested";
  loading: boolean;
}

const ServerCard = ({ server, status, onTest }: {
  server: Server;
  status: ServerStatus;
  onTest: (server: Server) => void;
}) => {
  const statusColor = useMemo(() => {
    switch (status.status) {
      case "Working":
        return "text-neon-green";
      case "Not Working":
        return "text-destructive";
      case "Testing...":
        return "text-yellow-400";
      case "Error":
        return "text-orange-400";
      default:
        return "text-muted-foreground";
    }
  }, [status.status]);

  const statusEmoji = useMemo(() => {
    switch (status.status) {
      case "Working":
        return "✅";
      case "Not Working":
        return "❌";
      case "Testing...":
        return "⏳";
      case "Error":
        return "⚠️";
      default:
        return "⚪";
    }
  }, [status.status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative p-6 rounded-xl shadow-lg border border-border overflow-hidden card-glow"
    >
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">{server.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">Type: {server.type}</p>
          <p className={`text-md font-medium ${statusColor}`}>
            Status: {statusEmoji} {status.status}
          </p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <a
            href={server.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-grow text-center px-4 py-2 rounded-lg btn-gradient text-sm"
          >
            Open Server
          </a>
          <button
            onClick={() => onTest(server)}
            disabled={status.loading}
            className="flex-grow px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-accent transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {status.loading ? "Testing..." : "Test"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SpeedTestSection = ({
  title,
  speed,
  loading,
  onTest,
  buttonText,
}: {
  title: string;
  speed: number | null;
  loading: boolean;
  onTest: () => void;
  buttonText: string;
}) => (
  <div className="relative p-6 rounded-xl shadow-lg border border-border overflow-hidden card-glow flex flex-col items-center justify-center">
    <div className="relative z-10 w-full flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-4 text-foreground">{title}</h3>
      <button
        onClick={onTest}
        disabled={loading}
        className="w-full px-6 py-3 rounded-lg btn-gradient"
      >
        {loading ? "Testing..." : buttonText}
      </button>
      {speed !== null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-3xl font-bold text-neon-blue"
        >
          {speed} <span className="text-xl text-muted-foreground">Mbps</span>
        </motion.p>
      )}
    </div>
  </div>
);

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [search, setSearch] = useState("");
  const [serverStatuses, setServerStatuses] = useState<Record<number, ServerStatus>>({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [globalSpeed, setGlobalSpeed] = useState<number | null>(null);
  const [bdixSpeed, setBdixSpeed] = useState<number | null>(null);
  const [loadingGlobalSpeed, setLoadingGlobalSpeed] = useState(false);
  const [loadingBdixSpeed, setLoadingBdixSpeed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetch("/servers.json")
      .then((res) => res.json())
      .then((data) => setServers(data));
  }, []);

  const checkServerStatus = useCallback(async (server: Server) => {
    setServerStatuses((prev) => ({ ...prev, [server.id]: { status: "Testing...", loading: true } }));
    try {
      const response = await fetch(`/api/check-server?url=${encodeURIComponent(server.url)}`);
      const data = await response.json();
      setServerStatuses((prev) => ({ ...prev, [server.id]: { status: data.status, loading: false } }));
    } catch (error) {
      console.error("Error checking server:", error);
      setServerStatuses((prev) => ({ ...prev, [server.id]: { status: "Error", loading: false } }));
    }
  }, []);

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

    const testFileUrl = type === "global"
      ? "https://speed.hetzner.de/100MB.bin" // A public 100MB test file
      : "/api/speed-test?size=10000000"; // Our local 10MB dummy file for BDIX

    const fileSize = type === "global" ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for global, 10MB for BDIX

    const startTime = new Date().getTime();

    try {
      const response = await fetch(testFileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to get reader");

      let receivedLength = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedLength += value.length;
      }

      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000; // seconds
      const bitsLoaded = receivedLength * 8; // bits
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
    return servers.filter((server) => {
      const matchesSearch = server.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || server.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [servers, search, selectedCategory]);

  const categorizedServers = useMemo(() => {
    return filteredServers.reduce((acc, server) => {
      if (!acc[server.type]) {
        acc[server.type] = [];
      }
      acc[server.type].push(server);
      return acc;
    }, {} as Record<string, Server[]>);
  }, [filteredServers]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(servers.map(s => s.type));
    return ["All", ...Array.from(categories).sort()];
  }, [servers]);

  return (
    <div className="font-sans bg-background text-foreground min-h-screen p-4 sm:p-8">
      <main className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 gradient-text">
            BDIX Nexus
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Your gateway to BDIX server status and internet speed insights.
          </p>
        </motion.div>

        <div className="mb-10 p-6 bg-card rounded-xl shadow-2xl border border-border">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Internet Speed Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpeedTestSection
              title="Global Connection Speed"
              speed={globalSpeed}
              loading={loadingGlobalSpeed}
              onTest={() => runSpeedTest("global")}
              buttonText="Test Global Speed"
            />
            <SpeedTestSection
              title="BDIX Connection Speed"
              speed={bdixSpeed}
              loading={loadingBdixSpeed}
              onTest={() => runSpeedTest("bdix")}
              buttonText="Test BDIX Speed"
            />
          </div>
        </div>

        <div className="mb-10 p-6 bg-card rounded-xl shadow-2xl border border-border">
          <h2 className="text-3xl font-bold mb-6 text-foreground">BDIX Server Status</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search servers..."
              className="flex-grow p-4 rounded-lg bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={testAllServers}
              disabled={loadingAll}
              className="px-6 py-3 rounded-lg btn-gradient font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loadingAll ? "Testing All..." : "Test All Servers"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {uniqueCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 
                  ${selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-secondary"}
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {Object.keys(categorizedServers).length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-muted-foreground text-lg mt-8"
            >
              No servers found matching your criteria.
            </motion.p>
          )}

          {Object.keys(categorizedServers).map((type) => (
            <div key={type} className="mb-8 last:mb-0">
              <h2 className="text-2xl font-bold mb-4 capitalize text-foreground border-b border-border pb-2">
                {type} Servers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categorizedServers[type].map((server) => (
                  <ServerCard
                    key={server.id}
                    server={server}
                    status={serverStatuses[server.id] || { status: "Not Tested", loading: false }}
                    onTest={checkServerStatus}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
