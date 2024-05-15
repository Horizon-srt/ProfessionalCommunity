'use client';
import React from 'react';
import SubscribeDetail from '@/components/SubscribeDetail';

const SubscribeDetailPage: React.FC<{ params: { sid: string } }> = ({
  params
}) => {
  return <SubscribeDetail srid={params.sid} />;
};

export default SubscribeDetailPage;
