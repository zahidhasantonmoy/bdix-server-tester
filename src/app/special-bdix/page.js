"use client";

import { useState } from 'react';

export default function SpecializedBDIXTest() {
  const [ipAddress, setIpAddress] = useState('');
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const testBDIXConnectivity = async () => {
    if (!ipAddress) {
      alert('Please enter an IP address');
      return;
    }

    setTesting(true);
    setResults([]);

    // BDIX-specific testing approach
    const testMethods = [
      {
        name: 'Direct HTTP',
        url: `http://${ipAddress}`,
        method: 'GET'
      },
      {
        name: 'Direct HTTPS',
        url: `https://${ipAddress}`,
        method: 'GET'
      },
      {
        name: 'Favicon Test',
        url: `http://${ipAddress}/favicon.ico`,
        method: 'HEAD'
      },
      {
        name: 'Root Path',
        url: `http://${ipAddress}/`,
        method: 'GET'
      }
    ];

    const methodResults = [];

    for (const test of testMethods) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(test.url, {
          method: test.method,
          mode: 'no-cors',
          signal: controller.signal,
          redirect: 'follow'
        });
        
        clearTimeout(timeoutId);
        
        methodResults.push({
          method: test.name,
          url: test.url,
          status: 'success',
          message: 'Connection established'
        });
      } catch (error) {
        methodResults.push({
          method: test.name,
          url: test.url,
          status: 'failed',
          message: error.message
        });
      }
    }

    // Determine overall result
    const successfulTests = methodResults.filter(r => r.status === 'success');
    const overallResult = successfulTests.length > 0 ? 'ACCESSIBLE' : 'NOT ACCESSIBLE';

    setResults([
      {
        ip: ipAddress,
        overall: overallResult,
        methods: methodResults
      }
    ]);

    setTesting(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Specialized BDIX Connectivity Test</h1>
      <p>Advanced testing for BDIX server accessibility.</p>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="Enter BDIX server IP (e.g., 172.16.50.4)"
          style={{ 
            padding: '12px', 
            flex: 1,
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={testBDIXConnectivity} 
          disabled={testing}
          style={{ 
            padding: '12px 24px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: testing ? 'not-allowed' : 'pointer'
          }}
        >
          {testing ? 'Testing...' : 'Test BDIX'}
        </button>
      </div>
      
      {results.length > 0 && results.map((result, index) => (
        <div key={index} style={{ 
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h2 style={{ 
            margin: '0 0 15px 0',
            color: result.overall === 'ACCESSIBLE' ? 'green' : 'red'
          }}>
            Server {result.ip}: {result.overall}
          </h2>
          
          <h3>Test Method Results:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {result.methods.map((method, methodIndex) => (
              <div 
                key={methodIndex}
                style={{ 
                  padding: '10px',
                  backgroundColor: method.status === 'success' ? '#d4edda' : '#f8d7da',
                  border: `1px solid ${method.status === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                  borderRadius: '3px'
                }}
              >
                <strong>{method.method}</strong><br/>
                <small>{method.url}</small><br/>
                <span style={{ 
                  color: method.status === 'success' ? 'green' : 'red',
                  fontSize: '12px'
                }}>
                  {method.status.toUpperCase()}: {method.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h3>BDIX Testing Information:</h3>
        <ul>
          <li>This tool tests multiple approaches to verify BDIX connectivity</li>
          <li>BDIX servers are only accessible from BDIX-enabled networks</li>
          <li>If you see &quot;ACCESSIBLE&quot;, you can likely access content from this server</li>
          <li>If you see &quot;NOT ACCESSIBLE&quot;, the server is likely blocked or you&apos;re not on BDIX</li>
        </ul>
        
        <h3>Common BDIX IPs:</h3>
        <ul>
          <li>172.16.50.4 (SAMONLINE)</li>
          <li>172.27.27.84 (WOW MOVIE ZONE)</li>
          <li>10.16.100.244 (ICC COMMUNICATION)</li>
          <li>103.58.73.9 (BUSINESS NET)</li>
        </ul>
      </div>
    </div>
  );
}