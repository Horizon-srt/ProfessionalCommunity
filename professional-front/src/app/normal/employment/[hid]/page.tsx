'use client';
import RecruiteDetail from '@/components/RecruitDetail';
import React from 'react';
// import ServiceEdit from '@/components/ServiceEdit';

const Main: React.FC<{ params: any }> = ({ params }) => {
  console.log(params.hid);
  return <RecruiteDetail hid={params.hid} />;
};

export default Main;