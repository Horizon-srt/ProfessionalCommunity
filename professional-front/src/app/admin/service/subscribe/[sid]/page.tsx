'use client';
import React from 'react';
import SubscribeDetail from '@/components/SubscribeDetail';

const SubscribeDetailPage: React.FC<{ params: { slug: string } }> = ({
  params
}) => {
  return <SubscribeDetail srid={params.slug} />;
};

export default SubscribeDetailPage;
