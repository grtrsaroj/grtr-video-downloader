"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Instagram({ url }) {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const fetchMedia = useCallback(async () => {
    if (!url) return; // Ensure URL is defined before fetching
    try {
      const response = await axios.get('/api/instagram', { params: { url } });
      const fetchedMedia = response.data.media || [];
      setMedia(fetchedMedia);
      setMediaTitle(response.data.title || '');
      setThumbnailUrl(response.data.thumbnailUrl || '');

      // Prefer video if available, otherwise fall back to first available media
      const videoMedia = fetchedMedia.find(item => item.type === 'video') || fetchedMedia.find(item => item.type === 'image');
      setSelectedMedia(videoMedia || null);
      setError(null);
    } catch (err) {
      setError('Failed to fetch media');
    }
  }, [url]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleDownload = () => {
    if (selectedMedia) {
      window.location.href = `/api/downloadig?media_url=${encodeURIComponent(selectedMedia.url)}`;
    }
  };

  const truncateTitle = (title, length) => {
    return title.length > length ? `${title.substring(0, length)}...` : title;
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        {thumbnailUrl && (
          <Image src={thumbnailUrl} alt={mediaTitle} width={120} height={90} className="rounded-md" />
        )}
        <div>
          <h3 className="text-xl font-semibold mb-2">{truncateTitle(mediaTitle, 50) || 'Instagram Media Downloader'}</h3>
          <p className="text-gray-600">Downloading media from: {url}</p>
        </div>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {selectedMedia ? (
        <div className="flex flex-col gap-4">
          <Button onClick={handleDownload} variant="primary" className="w-full mt-2">
            Download
          </Button>
        </div>
      ) : (
        <p>No media available</p>
      )}
    </div>
  );
}
