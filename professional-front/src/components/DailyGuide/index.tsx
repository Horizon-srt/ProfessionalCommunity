/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import Link from 'next/link';
// import useFetch from '@/services/use-fetch';
// import { ProvideMethod } from '@/types/data-types';

interface DailyGuideProps {
  width: string;
  height: string;
}

const DailyGuide: React.FC<DailyGuideProps> = ({ width, height }) => {
  const [type, setTypes] = useState('TOURIST');
  // const [fetchParam, setFetchParam] = useState({
  //   url: '',
  //   method: 'GET' as ProvideMethod,
  //   params: {}
  // });

  // useEffect(() => {
  //   setTypes(localStorage.getItem('user-type') || 'TOURIST');
  // }, []);

  // const guideListFetch = useFetch({
  //   url: '/guides',
  //   method: 'GET',
  //   params: {
  //     offset: 1,
  //     pageNumber: 1
  //   }
  // });

  // useEffect(() => {
  //   setFetchParam({
  //     url: `/guides?gid=${guideListFetch.data.guides.gid}`,
  //     method: 'GET' as ProvideMethod,
  //     params: {}
  //   });
  // }, [guideListFetch.data.guides.gid, guideListFetch.isLoading]);

  // const { data, isLoading } = useFetch(fetchParam);

  const data = {
    gid: '1',
    author: 'string',
    title: 'string',
    content: 'string',
    date: 'string',
    cover: 'string'
  };

  const isLoading = false;

  return (
    <Card
      title={
        <div style={{ fontWeight: 'bold' }}>{`Guide - ${data.title}`}</div>
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
        borderRadius: '0px',
        overflow: 'auto'
      }}
      styles={{ body: { paddingTop: '0px' } }}
    >
      <Spin spinning={isLoading} size='large'>
        <div>{data.content}</div>
        {/* {isLoading ? (
          <div></div>
        ) : (

        )} */}
      </Spin>
    </Card>
  );
};

export default DailyGuide;
