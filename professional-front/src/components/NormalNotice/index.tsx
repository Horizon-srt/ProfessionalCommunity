'use client';
import { AnounceItem } from '@/components/AnounceItem/AnounceItem';
import Card from '@/components/Card';
import { usePagination } from '@/hooks/usePagination';
import useFetch from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { Empty, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';

interface INotice {
  nid: string;
  title: string;
  time: string;
  content_slice: string;
}
const NormalNotice: React.FC = () => {
  const [userType, setUserType] = useState('TOURIST');
  const { offset, pageNum, setCurrentPage } = usePagination({
    offset: 10,
    pageNum: 1
  });
  const { data = [] } = useFetch({
    url: '/notifies/all',
    method: 'GET' as ProvideMethod,
    params: {
      pageNum,
      offset
    }
  });

  useEffect(() => {
    setUserType(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  return (
    <div className='p-4 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
              <div>News Anouncement</div>
            </div>
          </div>
          <div className='w-full h-full flex flex-col p-8'>
            {(!data?.notifies || data?.notifies?.length === 0) && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {data?.notifies?.map((data: INotice) => (
              <AnounceItem
                link={`/${userType.toLowerCase()}/notice/${data.nid}`}
                data={data}
                key={data.nid}
              />
            ))}
          </div>
          <div className='w-full flex justify-center'>
            <Pagination
              defaultCurrent={1}
              total={(data?.allPages || 1) * 10}
              showSizeChanger={false}
              current={pageNum}
              onChange={page => {
                setCurrentPage(page);
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NormalNotice;
