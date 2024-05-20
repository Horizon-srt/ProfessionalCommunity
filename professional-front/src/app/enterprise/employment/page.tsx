'use client';
import React, { useEffect } from 'react';
import { Empty, Pagination, message } from 'antd';
import Card from '@/components/Card';
import { RecruitItem } from '@/components/RecruitmentItem';
import { usePagination } from '@/hooks/usePagination';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useStore';

const Employment: React.FC = () => {
  const { offset, pageNum, setCurrentPage } = usePagination({
    offset: 5,
    pageNum: 1
  });

  const uid = useStore(state => state.uid);
  const { data } = useFetch({
    url: '/hires/all/' + uid,
    method: 'GET' as ProvideMethod,
    params: {
      pageNum,
      offset
    }
  });

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
            {/* todos */}
            {data?.data?.length ? (
              data?.data.map((data: any) => (
                <RecruitItem
                  key={data.hid}
                  rInfo={data}
                  deleteHire={deleteHire}
                />
              ))
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
          <div className='w-full flex justify-end'>
            <Pagination
              current={pageNum}
              total={(data?.allPages || 1) * 5}
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
