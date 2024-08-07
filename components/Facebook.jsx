"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export default function Facebook() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchInfo = async () => {
    try {
      const response = await axios.post('/api/facebook', { url });
      setVideoInfo(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching video information');
    }
  };

  const handleDownload = async (link) => {
    try {
      const response = await axios.post('/api/downloadfv', {
        url: link.url,
        name: videoInfo.name
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = videoInfo.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.response?.data?.error || 'Error downloading video');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Facebook Video Downloader</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter Facebook video URL"
        className="border p-2 mb-2 w-full"
      />
      <Button onClick={handleFetchInfo} className="bg-blue-500 text-white p-2 rounded">
        Get Video Info
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {videoInfo && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Available Quality Options:</h3>
          <ul>
            {videoInfo.links.map((link, index) => (
              <li key={index}>
                <Button onClick={() => handleDownload(link)} className="bg-green-500 text-white p-2 rounded mt-2 block">
                  {link.quality}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
