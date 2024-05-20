/* eslint-disable max-len */
'use client';
import { Card, Image, Spin, message } from 'antd';
import React, { useEffect } from 'react';
import useFetch from '@/services/use-fetch';
import styles from './styles/styles.module.css';

const Detail: React.FC<{ params: { detail: string } }> = ({ params }) => {
  const { data, isLoading, error } = useFetch({
    url: `/guides/${params.detail}`,
    method: 'GET',
    params: {}
  });

  useEffect(() => {
    if (!isLoading && error) {
      message.error(error);
    }
  }, [isLoading, error]);

  return (
    <div className='px-32 h-full'>
      <Card className={styles.card} style={{ overflow: 'auto' }}>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]' />
              <div style={{ fontSize: '2.5rem' }}>{data?.title || ''}</div>
            </div>
          </div>
          <div>
            <div style={{ overflow: 'auto' }}>
              {!isLoading && data ? (
                <>
                  <hr />
                  <Image
                    src={data.cover}
                    alt={'Community pictures'}
                    height={'100%'}
                    width={'100%'}
                  />
                  <div style={{ wordWrap: 'break-word' }}>{data.content}</div>
                </>
              ) : (
                <Spin spinning={isLoading} />
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Detail;
