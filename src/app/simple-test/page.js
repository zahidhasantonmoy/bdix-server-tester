"use client";

import { useState } from 'react';

export default function SimpleTest() {
  const [testUrl, setTestUrl] = useState('');
  const [result, setResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const testConnectivity = async () => {
    if (!testUrl) {
      setResult('Please enter a URL');
      return;
    }

    setIsTesting(true);
    setResult('');

    try {
      // Method 1: Try fetch with no-cors
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      await fetch(testUrl, {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setResult('SUCCESS: Server is reachable');
    } catch (error) {
      // Method 2: Try image loading
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          const timeoutId = setTimeout(() => {
            reject(new Error('Timeout'));
          }, 3000);
          
          img.onload = () => {
            clearTimeout(timeoutId);
            resolve();
          };
          
          img.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error('Failed to load'));
          };
          
          img.src = `${testUrl}/favicon.ico`;
        });
        setResult('SUCCESS: Server is reachable (image method)');
      } catch (imgError) {
        setResult('FAILED: Server is not reachable');
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Simple BDIX Connectivity Test</h1>
      <p>This tool tests if you can reach BDIX servers from your network.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          placeholder="Enter URL (e.g., http://172.16.50.4)"
          style={{ 
            padding: '10px', 
            width: '70%', 
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={testConnectivity} 
          disabled={isTesting}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          {isTesting ? 'Testing...' : 'Test'}
        </button>
      </div>
      
      {result && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: result.startsWith('SUCCESS') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.startsWith('SUCCESS') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          color: result.startsWith('SUCCESS') ? '#155724' : '#721c24'
        }}>
          <strong>{result}</strong>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>Sample BDIX Servers to Test:</h3>
        <ul>
          <li><strong>SAMONLINE:</strong> http://172.16.50.4</li>
          <li><strong>DISCOVERY FTP:</strong> http://discoveryftp.net</li>
          <li><strong>WOW MOVIE ZONE:</strong> http://172.27.27.84</li>
          <li><strong>BUSINESS NET:</strong> http://103.58.73.9</li>
        </ul>
        <p><em>Note: Test these only if you're on a BDIX-enabled network.</em></p>
      </div>
    </div>
  );
}