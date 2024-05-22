'use client';
import { Button, Card, Col, Row, Spin, message } from 'antd';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles/style.module.css';
import useFetch from '@/services/use-fetch';

const Detail: React.FC<{ params: { detail: string } }> = ({ params }) => {
  const router = useRouter();
  const { data, isLoading, error } = useFetch({
    url: `/hires/${params.detail}`,
    method: 'GET',
    params: {}
  });

  useEffect(() => {
    if (!isLoading && error) {
      message.error(error);
    }
  }, [isLoading, error]);
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
          <div className='f-col px-[5%] py-[4%]'>
            {!isLoading && data ? (
              <>
                <div className={styles.h1Title} style={{ fontSize: '1.5rem' }}>
                  Basic Information
                </div>
                <div className={styles.customCard}>
                  <Row className={styles.rowStyle} gutter={16}>
                    <Col span={8} style={{ fontSize: '1.25rem' }}>
                      Company:
                    </Col>
                    <Col span={8} style={{ fontSize: '1.25rem' }}>
                      Title:
                    </Col>
                    <Col span={8} style={{ fontSize: '1.25rem' }}>
                      Time:
                    </Col>
                  </Row>
                  <Row className={styles.rowStyle} gutter={16}>
                    <Col span={8} style={{ fontSize: '1.25rem' }}>
                      {data.ename}
                    </Col>
                    <Col span={8} style={{ fontSize: '1.25rem' }}>
                      {data.title}
                    </Col>
                    <Col span={8} style={{ fontSize: '1.25rem' }}>
                      {data.start_time} - {data.end_time}
                    </Col>
                  </Row>
                </div>
                <div className={styles.h1Title} style={{ fontSize: '1.5rem' }}>
                  Details
                </div>
                <div
                  className={styles.detailText}
                  style={{ fontSize: '1.25rem' }}
                >
                  {data.content}
                </div>
              </>
            ) : (
              <Spin spinning={isLoading} />
            )}
            <div className='flex justify-center pt-10'>
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
