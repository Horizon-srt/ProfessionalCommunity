'use client';
import { Button, Card } from 'antd';
import React from 'react';
import Image from 'next/image';
import img from '@/../public/next.svg';
import { useRouter } from 'next/navigation';

const Detail: React.FC<{ params: { detail: string } }> = ({ params }) => {
  const router = useRouter();
  const list: any = {
    bid: 1,
    title: '招聘摄影师',
    company: '1号公司',
    startTime: '2022.1.1',
    endTime: '2023.1.1',
    details: '***********'
  };
  return (
    <div className='p-20 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]'></div>
              <div style={{ fontSize: '2.5rem' }}>Recruit Detail</div>
            </div>
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Title: {list.title}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Company: {list.company}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Time: {list.startTime} - {list.endTime}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Details: {list.details}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            <Button onClick={() => router.push('/admin/review')}>back</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Detail;
