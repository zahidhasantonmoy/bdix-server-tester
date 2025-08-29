import { useState, useEffect, useCallback } from 'react';

// Define the Server interface to match what's used in page.tsx
interface Server {
  id: number;
  name: string;
  addresses: string[];
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
    // For now, we'll test the first address in the addresses array
    const url = server.addresses[0];
    const startTime = Date.now();
    try {
      // We're using no-cors mode to avoid CORS issues
      // This means we won't be able to read the response body,
      // but we can still check if the server is reachable.
      await fetch(url, { mode: 'no-cors' });
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        id: server.id,
        status: 'online',
        responseTime: responseTime,
      };
    } catch (error: unknown) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {
        id: server.id,
        status: 'offline',
        responseTime: responseTime,
        error: errorMessage,
      };
    }
  }, []);

  const startTesting = useCallback(async (concurrencyLimit: number = 5) => {
    setIsTesting(true);
    // Initialize all servers as "testing"
    const initialResults = servers.map(server => ({ 
      id: server.id, 
      status: 'testing' as const,
      responseTime: undefined,
      error: undefined
    }));
    setTestResults(initialResults);

    const queue = [...servers];
    const activePromises: Promise<void>[] = [];

    const processQueue = async () => {
      while (queue.length > 0 || activePromises.length > 0) {
        // Start new tests if concurrency limit allows
        while (queue.length > 0 && activePromises.length < concurrencyLimit) {
          const server = queue.shift();
          if (server) {
            const promise = testServer(server).then(result => {
              setTestResults(prevResults =>
                prevResults.map(r => (r.id === result.id ? result : r))
              );
            }).finally(() => {
              // Remove the promise from activePromises when it settles
              const index = activePromises.indexOf(promise);
              if (index !== -1) {
                activePromises.splice(index, 1);
              }
            });
            activePromises.push(promise);
          }
        }
        // Wait for at least one active promise to settle before continuing
        if (activePromises.length > 0) {
          await Promise.race(activePromises);
        } else if (queue.length === 0) {
          // If queue is empty and no active promises, we are done
          break;
        }
      }
    };

    await processQueue();
    setIsTesting(false);
  }, [servers, testServer]);

  const resetTesting = useCallback(() => {
    setTestResults([]);
    setIsTesting(false);
  }, []);

  useEffect(() => {
    // Initialize test results when servers change
    const initialResults = servers.map(server => ({ 
      id: server.id, 
      status: 'testing' as const,
      responseTime: undefined,
      error: undefined
    }));
    setTestResults(initialResults);
  }, [servers]);


  return { testResults, isTesting, startTesting, resetTesting };
};

export default useServerTester;