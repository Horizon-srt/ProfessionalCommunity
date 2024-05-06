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
    name: '张三',
    email: '123@163.com',
    phone: '123456789012',
    building: '14号楼',
    unit: '1单元',
    room: '323室',
    password: '***********',
    proof: ''
  };
  return (
    <div className='p-20 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]'></div>
              <div style={{ fontSize: '2.5rem' }}>Profile Detail</div>
            </div>
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Name: {list.name}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Email: {list.email}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Phone: {list.phone}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Building: {list.building}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Unit: {list.unit}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Room: {list.room}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Password: {list.password}
          </div>
          <div className='flex justify-center' style={{ fontSize: '2.5rem' }}>
            Proof: <Image src={img} alt={''} width={160} height={100} />
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
