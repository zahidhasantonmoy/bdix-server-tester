import { useState, useEffect, useCallback } from 'react';

interface Server {
  id: number;
  name: string;
  url: string;
  type: string;
}

interface TestResult {
  id: number;
  status: 'testing' | 'online' | 'offline';
  responseTime?: number; // in ms
  error?: string;
}

const useServerTester = (servers: Server[]) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const testServer = useCallback(async (server: Server): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await fetch(server.url, { mode: 'no-cors' }); // Use no-cors for external URLs
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // For no-cors, we can't check status directly, so we assume success if no network error
      // A more robust solution would involve a proxy or a backend endpoint
      return {
        id: server.id,
        status: 'online',
        responseTime: responseTime,
      };
    } catch (error: any) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      return {
        id: server.id,
        status: 'offline',
        responseTime: responseTime,
        error: error.message,
      };
    }
  }, []);

  const startTesting = useCallback(async () => {
    setIsTesting(true);
    setTestResults(servers.map(server => ({ id: server.id, status: 'testing' })));

    const results: TestResult[] = [];
    for (const server of servers) {
      const result = await testServer(server);
      results.push(result);
      setTestResults(prevResults =>
        prevResults.map(r => (r.id === result.id ? result : r))
      );
    }
    setIsTesting(false);
  }, [servers, testServer]);

  const resetTesting = useCallback(() => {
    setTestResults([]);
    setIsTesting(false);
  }, []);

  useEffect(() => {
    // Initialize test results when servers change
    setTestResults(servers.map(server => ({ id: server.id, status: 'testing' })));
  }, [servers]);


  return { testResults, isTesting, startTesting, resetTesting };
};

export default useServerTester;
