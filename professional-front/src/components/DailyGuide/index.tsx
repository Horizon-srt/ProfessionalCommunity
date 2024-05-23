/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import Link from 'next/link';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';

interface DailyGuideProps {
  width: string;
  height: string;
}

const DailyGuide: React.FC<DailyGuideProps> = ({ width, height }) => {
  const [type, setTypes] = useState('TOURIST');
  const defaultFetchParams = {
    url: '',
    method: 'GET' as ProvideMethod,
    params: {}
  };

  useEffect(() => {
    setTypes(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  const {
    data: guideListData,
    isLoading,
    error: guideListError
  } = useFetch({
    url: '/guides',
    method: 'GET',
    params: {
      offset: 1,
      pageNumber: 1
    }
  });

  const {
    data,
    isMutating,
    trigger,
    error: guideError
  } = useFetchMutation(defaultFetchParams);

  useEffect(() => {
    if (!isLoading && guideListError) {
      message.error(guideListError);
    }
  }, [isLoading, guideListError]);

  useEffect(() => {
    if (!isMutating && guideError) {
      message.error(guideError);
    }
  }, [isMutating, guideError]);

  useEffect(() => {
    if (!isLoading && !guideListError && (guideListData?.guides || [])) {
      if (guideListData?.guides?.[0]?.gid || false) {
        trigger({
          ...defaultFetchParams,
          url: `/guides/${guideListData?.guides[0]?.gid || ''}`
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideListData]);

  return (
    <Card
      title={
        <div
          style={{ fontWeight: 'bold' }}
        >{`Guide - ${data?.title || ''}`}</div>
      }
      extra={
        <Link
          href={`/${type.toLowerCase()}/guide`}
          style={{ color: '#16A609' }}
        >
          {'More >'}
        </Link>
      }
      style={{
        width: width,
        height: height,
        borderRadius: '20px',
        overflow: 'auto'
      }}
      styles={{ body: { paddingTop: '0px' } }}
    >
      <Spin spinning={isLoading} size='large'>
        {isLoading ? (
          <div></div>
        ) : (
          <div style={{ wordWrap: 'break-word', marginTop: '1rem' }}>
            {data?.content}
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default DailyGuide;
