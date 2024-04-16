'use client';
import TopBar from '@/components/Topbar';
import React from 'react';
import Library from '@/components/library';

const Tourist: React.FC = () => {
  return (
    // <main>
    <div>
      <TopBar></TopBar>
      <h1>Tourist page</h1>
      <Library></Library>
    </div>
  );
};

export default Tourist;
