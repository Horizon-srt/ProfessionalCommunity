'use client';
import React, { useEffect } from 'react';
import { Pagination, message } from 'antd';
import Card from '@/components/Card';
import { RecruitItem } from '@/components/RecruitmentItem';
import { usePagination } from '@/hooks/usePagination';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { useRouter } from 'next/navigation';

const Employment: React.FC = () => {
  const { offset, pageNum, setCurrentPage } = usePagination({
    offset: 5,
    pageNum: 1
  });

  // 先写死，不确定是context传递还是props传递
  const companyName = '1234';
  const { data } = useFetch({
    url: '/hires/all',
    method: 'GET' as ProvideMethod,
    params: {
      ename: companyName,
      pageNum,
      offset
    }
  });

  const mockDatas = [
    {
      hid: '13131',
      title: 'title111',
      ename: 'company11',
      start_time: '2024-2-5',
      end_time: '2025-2-6',
      content_slice: '23u242',
      status: 1
    }
  ];

  const {
    data: hireData,
    error,
    trigger: deleteHire
  } = useFetchMutation({
    url: '/hires/:hid',
    method: 'DELETE' as ProvideMethod,
    params: null
  });

  useEffect(() => {
    if (error) {
      message.error(error.toString());
    }
    if (hireData) {
      message.success('Delete Successful');
    }
  }, [hireData, error]);

  const router = useRouter();

  return (
    <div className='flex flex-col justify-between h-full p-4 overflow-auto'>
      <Card
        title={
          <div className='relative flex flex-row justify-between'>
            <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
            <div className='text-lg'>My Recruitment</div>
            <div
              className='text-green-500 text-lg cursor-pointer'
              onClick={() => router.push('/enterprise/employment/create')}
            >
              +
            </div>
          </div>
        }
      >
        <div className='h-full w-full'>
          <div
            className={`h-[80%] w-full flex flex-col justify-start 
             align-center`}
          >
            {mockDatas.map(data => (
              <RecruitItem
                key={data.hid}
                rInfo={data}
                deleteHire={deleteHire}
              />
            ))}
          </div>
          <div className='w-full flex justify-end'>
            <Pagination
              defaultCurrent={1}
              total={72}
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

export default Employment;
