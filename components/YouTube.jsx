"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function YouTube({ url }) {
  const [formats, setFormats] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const fetchVideoFormats = useCallback(async () => {
    if (!url) return; // Ensure URL is defined before fetching
    try {
      const response = await axios.get('/api/youtube', { params: { url } });
      setFormats(response.data.formats || []);
      setVideoTitle(response.data.title || '');
      setThumbnailUrl(response.data.thumbnailUrl || '');
      setError(null);
    } catch (err) {
      setError('Failed to fetch video formats');
    }
  }, [url]);

  useEffect(() => {
    fetchVideoFormats();
  }, [fetchVideoFormats]);

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
  };

  const handleDownload = () => {
    if (selectedFormat) {
      window.location.href = `/api/downloadyt?url=${encodeURIComponent(url)}&format=${selectedFormat.itag}`;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        {thumbnailUrl && (
          <Image src={thumbnailUrl} alt={videoTitle} width={120} height={90} className="rounded-md" />
        )}
        <div>
          <h3 className="text-xl font-semibold mb-2">{videoTitle || 'YouTube Video Downloader'}</h3>
          <p className="text-gray-600">Downloading video from: {url}</p>
        </div>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {formats.length > 0 ? (
        <div className="flex flex-col gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {selectedFormat ? `${selectedFormat.container} - ${selectedFormat.qualityLabel || 'Quality Unknown'}` : 'Select Quality'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex overflow-x-auto bg-white shadow-lg rounded-md border border-gray-200 p-2 space-x-2 scrollbar-thin scrollbar-thumb-gray-300">
              {formats.map((format) => (
                <DropdownMenuItem
                  key={format.itag}
                  onClick={() => handleFormatSelect(format)}
                  className="flex-shrink-0 flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  <span>{format.container}</span>
                  <span className="text-gray-500">{format.qualityLabel || 'Quality Unknown'}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="my-1 border-gray-200" />
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedFormat && (
            <Button onClick={handleDownload} variant="primary" className="w-full mt-2">
              Download
            </Button>
          )}
        </div>
      ) : (
        <p>No formats available</p>
      )}
    </div>
  );
}
