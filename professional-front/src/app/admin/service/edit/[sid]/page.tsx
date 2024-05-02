'use client';
import React from 'react';
import ServiceEdit from '@/components/ServiceEdit';

const Main: React.FC<{ params: { slug: string } }> = ({ params }) => {
  return <ServiceEdit title={'Change Service'} sid={params.slug} />;
};

export default Main;
