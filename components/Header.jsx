"use client"
import React from 'react';
import ModeToggle from './mode-toggle';

function Header() {
  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <header className="flex items-center justify-between p-4 shadow-md w-full">
      <h1 
        className="text-xl font-bold cursor-pointer" 
        onClick={handleHomeClick}
      >
        Video Downloader
      </h1>
      <ModeToggle />
    </header>
  );
}

export default Header;
