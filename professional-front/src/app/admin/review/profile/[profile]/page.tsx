'use client';
import { Button, Card, Spin, message } from 'antd';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useFetch from '@/services/use-fetch';
import styles from './styles/style.module.css';

const Detail: React.FC<{ params: { profile: string } }> = ({ params }) => {
  const router = useRouter();
  const { data, isLoading, error } = useFetch({
    url: `/users/${params.profile}`,
    method: 'GET',
    params: {}
  });

  useEffect(() => {
    if (!isLoading && error) {
      message.error(error);
    }
  }, [isLoading, error]);

  return (
    <div className={styles.main}>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]'></div>
              <div style={{ fontSize: '2.5rem' }}>Profile Detail</div>
            </div>
          </div>
          <div className='flex-col justify-center px-[30%] pt-[4%]'>
            {!isLoading && data ? (
              <>
                <div className='p-[3%]' style={{ fontSize: ' 1.5rem' }}>
                  Name: {data.name}
                </div>
                <div className='p-[3%]' style={{ fontSize: ' 1.5rem' }}>
                  Email: {data.email}
                </div>
                <div className='p-[3%]' style={{ fontSize: ' 1.5rem' }}>
                  Phone: {data.phone}
                </div>
                <div className='p-[3%]' style={{ fontSize: ' 1.5rem' }}>
                  Building: {data.building}
                </div>
                <div className='p-[3%]' style={{ fontSize: ' 1.5rem' }}>
                  Unit: {data.unit}
                </div>
                <div className='p-[3%]' style={{ fontSize: ' 1.5rem' }}>
                  Room: {data.room}
                </div>
                {/* <div className='p-[3%]' style={{ fontSize: ' 1.5rem' }}>
                  Password: {data.password}
                </div>
                <div className='p-[3%]' style={{ fontSize: ' 1.5rem' }}>
                  Proof: <Image src={img} alt={''} width={160} height={100} />
                </div> */}
              </>
            ) : (
              <Spin spinning={isLoading} />
            )}
            <div
              className='flex justify-center pt-10'
              style={{ fontSize: '2.5rem' }}
            >
              <Button
                style={{ width: 200 }}
                onClick={() => router.push('/admin/review')}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Detail;
