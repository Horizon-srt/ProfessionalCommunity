'use client';
import NoticeDetail from '@/components/NoticeDetail';
// import RecruiteDetail from '@/components/RecruitDetail';
import React from 'react';
// import ServiceEdit from '@/components/ServiceEdit';

const Main: React.FC<{ params: any }> = ({ params }) => {
  console.log(params.nid);
  return <NoticeDetail nid={params.nid} />;
};

export default Main;
