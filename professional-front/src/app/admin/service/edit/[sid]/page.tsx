'use client';
import React from 'react';
import ServiceEdit from '@/components/ServiceEdit';

const Main: React.FC<{ params: { sid: string } }> = ({ params }) => {
  return <ServiceEdit title={'Change Service'} sid={params.sid} />;
};

export default Main;
