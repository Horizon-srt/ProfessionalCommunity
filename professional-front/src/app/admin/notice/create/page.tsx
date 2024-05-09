'use client';
import NoticeCreate from '@/components/NoticeCreate';
import React from 'react';

const Main: React.FC<{ params: any }> = ({ params }) => {
  console.log(params.nid);
  return <NoticeCreate />;
};

export default Main;
