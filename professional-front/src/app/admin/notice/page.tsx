/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { AnounceItem } from '@/components/AnounceItem/AnounceItem';
import Card from '@/components/Card';
import { usePagination } from '@/hooks/usePagination';
import { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Empty, Pagination, message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './styles/style.module.css';

interface INotice {
  nid: string;
  title: string;
  time: string;
  content_slice: string;
}
const Tourist: React.FC = () => {
  const [userType, setUserType] = useState('TOURIST');
  const router = useRouter();
  const defaultFetchParams = {
    url: '/notifies/all',
    method: 'GET' as ProvideMethod,
    params: {
      pageNum: 1,
      offset: 10
    }
  };

  const { offset, pageNum, setCurrentPage } = usePagination({
    offset: 10,
    pageNum: 1
  });

  const { data, isMutating, error, trigger } =
    useFetchMutation(defaultFetchParams);

  // const mockData = [
  //   {
  //     nid: '11111',
  //     title: 'aaa',
  //     time: '2024-4-16',
  //     content_slice: 'heoihilwjdlwkanlk'
  //   }
  // ];

  useEffect(() => {
    setUserType(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  useEffect(() => {
    trigger({
      ...defaultFetchParams,
      params: {
        pageNum,
        offset
      }
    });
  }, [offset, pageNum]);

  useEffect(() => {
    if (!isMutating && error) {
      message.error(error);
    }
  }, [isMutating, error]);

  const flashTrigger = async () => {
    trigger({
      ...defaultFetchParams,
      params: {
        pageNum,
        offset
      }
    });
  };

  return (
    <div className={styles.main}>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between w-full'>
            <div className='relative flex items-center'>
              <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]' />
              <div style={{ fontSize: '2.5rem' }}>News Anouncement</div>
            </div>
            <div
              className='flex items-center cursor-pointer'
              onClick={() => router.push('/admin/notice/create')}
            >
              <PlusSquareOutlined
                style={{ fontSize: '1rem', color: '#6DC570' }}
              />
            </div>
          </div>
          <div className='w-full h-full flex flex-col p-8'>
            {(!data?.notifies || data?.notifies?.length === 0) && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {/* {data?.map((data: INotice) => ( */}
            {data?.notifies?.map((data: INotice) => (
              <AnounceItem
                flasTtrigger={flashTrigger}
                link={`/${userType.toLowerCase()}/notice/${data.nid}`}
                data={data}
                key={data.content_slice}
              />
            ))}
          </div>
          <div className='w-full flex justify-center'>
            <Pagination
              defaultCurrent={1}
              total={data?.total_pages || 1}
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

export default Tourist;
