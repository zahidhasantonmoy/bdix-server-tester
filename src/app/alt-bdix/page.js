"use client";

import { useState } from 'react';

export default function AlternativeBDIXTest() {
  const [testUrl, setTestUrl] = useState('');
  const [result, setResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const runBDIXTest = async () => {
    if (!testUrl) {
      setResult({ status: 'error', message: 'Please enter a server URL' });
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      // Normalize URL
      let url = testUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `http://${url}`;
      }

      // Method 1: Try direct fetch
      const startTime = Date.now();
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          redirect: 'follow'
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        setResult({
          status: 'success',
          message: `Server is accessible via direct connection`,
          time: duration,
          method: 'fetch'
        });
        return;
      } catch (fetchError) {
        // Method 2: Try XMLHttpRequest
        try {
          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const timeout = setTimeout(() => {
              xhr.abort();
              reject(new Error('Timeout'));
            }, 3000);
            
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                clearTimeout(timeout);
                if (xhr.status > 0) {
                  resolve(xhr);
                } else {
                  reject(new Error('No response'));
                }
              }
            };
            
            xhr.onerror = function() {
              clearTimeout(timeout);
              reject(new Error('Network error'));
            };
            
            xhr.ontimeout = function() {
              reject(new Error('Timeout'));
            };
            
            xhr.open('GET', url, true);
            xhr.timeout = 3000;
            xhr.send();
          });
          
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          setResult({
            status: 'success',
            message: `Server is accessible via XMLHttpRequest`,
            time: duration,
            method: 'xhr'
          });
          return;
        } catch (xhrError) {
          // Method 3: Try image loading (fallback)
          try {
            await new Promise((resolve, reject) => {
              const img = new Image();
              const timeout = setTimeout(() => {
                reject(new Error('Image load timeout'));
              }, 3000);
              
              img.onload = function() {
                clearTimeout(timeout);
                resolve();
              };
              
              img.onerror = function() {
                clearTimeout(timeout);
                reject(new Error('Image failed to load'));
              };
              
              img.src = `${url}/favicon.ico`;
            });
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            setResult({
              status: 'partial',
              message: `Server responded to favicon request`,
              time: duration,
              method: 'image'
            });
            return;
          } catch (imageError) {
            setResult({
              status: 'failed',
              message: `Server is not accessible: ${imageError.message}`,
              method: 'all'
            });
          }
        }
      }
    } catch (error) {
      setResult({
        status: 'error',
        message: `Test failed: ${error.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Alternative BDIX Test</h1>
      <p>Alternative approach to testing BDIX server connectivity.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          placeholder="Enter BDIX server URL (e.g., 172.16.50.4)"
          style={{ 
            padding: '12px', 
            width: '70%', 
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={runBDIXTest} 
          disabled={testing}
          style={{ 
            padding: '12px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: testing ? 'not-allowed' : 'pointer'
          }}
        >
          {testing ? 'Testing...' : 'Test'}
        </button>
      </div>
      
      {result && (
        <div style={{ 
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: result.status === 'success' ? '#d4edda' : 
                         result.status === 'partial' ? '#fff3cd' : 
                         result.status === 'failed' || result.status === 'error' ? '#f8d7da' : '#f8f9fa',
          border: `1px solid ${
            result.status === 'success' ? '#c3e6cb' : 
            result.status === 'partial' ? '#ffeaa7' : 
            result.status === 'failed' || result.status === 'error' ? '#f5c6cb' : '#ddd'
          }`
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>
            Result: {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
          </h3>
          <p style={{ margin: '5px 0' }}><strong>Message:</strong> {result.message}</p>
          {result.time && <p style={{ margin: '5px 0' }}><strong>Time:</strong> {result.time}ms</p>}
          {result.method && <p style={{ margin: '5px 0' }}><strong>Method:</strong> {result.method}</p>}
        </div>
      )}
      
      <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h3>Sample BDIX Servers:</h3>
        <ul>
          <li><strong>SAMONLINE:</strong> 172.16.50.4</li>
          <li><strong>DISCOVERY FTP:</strong> discoveryftp.net</li>
          <li><strong>WOW MOVIE ZONE:</strong> 172.27.27.84</li>
          <li><strong>BUSINESS NET:</strong> 103.58.73.9</li>
          <li><strong>ICC COMMUNICATION:</strong> 10.16.100.244</li>
        </ul>
        <p><strong>Important:</strong> These tests work best when you&apos;re connected to a BDIX-enabled ISP.</p>
      </div>
    </div>
  );
}