"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import YouTube from "@/components/YouTube";
import TikTok from "@/components/TikTok";
import Facebook from "@/components/Facebook";
import Instagram from "@/components/Instagram";

export default function Home() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("");

  const handleDownload = () => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      setPlatform("YouTube");
    } else if (url.includes("tiktok.com")) {
      setPlatform("TikTok");
    } else if (url.includes("facebook.com")) {
      setPlatform("Facebook");
    } else if (url.includes("instagram.com")) {
      setPlatform("Instagram");
    } else {
      setPlatform("");
      alert("Unsupported platform");
    }
  };

  const renderComponent = () => {
    switch (platform) {
      case "YouTube":
        return <YouTube url={url} />;
      case "TikTok":
        return <TikTok url={url} />;
      case "Facebook":
        return <Facebook url={url} />;
      case "Instagram":
        return <Instagram url={url} />;
      default:
        return null;
    }
  };

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Video Downloader
      </h2>
      <p className="leading-7 mt-6">Download any video from social platforms</p>
      <div className="flex items-center mt-4 space-x-4">
        <Input
          type="text"
          placeholder="Enter video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-2 border rounded-md"
        />
        <Button onClick={handleDownload} className="p-2">Download</Button>
      </div>
      <div className="mt-6">
        {renderComponent()}
      </div>
    </>
  );
}
