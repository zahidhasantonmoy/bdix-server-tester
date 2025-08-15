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
      const response = await fetch(server.url, { mode: 'no-cors' });
      const endTime = Date.now();
      const responseTime = endTime - startTime;

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

  const startTesting = useCallback(async (concurrencyLimit: number = 5) => { // Added concurrencyLimit
    setIsTesting(true);
    setTestResults(servers.map(server => ({ id: server.id, status: 'testing' })));

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
              activePromises.splice(activePromises.indexOf(promise), 1);
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
    setTestResults(servers.map(server => ({ id: server.id, status: 'testing' })));
  }, [servers]);


  return { testResults, isTesting, startTesting, resetTesting };
};

export default useServerTester;