'use client';
import React from 'react';
import ServiceDetail from '@/components/ServiceDetail';

const Main: React.FC<{ params: { slug: string } }> = ({ params }) => {
  return <ServiceDetail slug={params.slug} />;
};

export default Main;
