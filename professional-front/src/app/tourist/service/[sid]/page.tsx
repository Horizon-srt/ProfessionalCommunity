'use client';
import React from 'react';
import ServiceDetail from '@/components/ServiceDetail';

const Main: React.FC<{ params: { sid: string } }> = ({ params }) => {
  return <ServiceDetail slug={params.sid} />;
};

export default Main;
