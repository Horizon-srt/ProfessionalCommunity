'use client';
import React, { useEffect } from 'react';
import { Empty, Pagination, Spin, message } from 'antd';
import { EmployItem } from '@/components/EmployItem';
import Link from 'next/link';
import { usePagination } from '@/hooks/usePagination';
import useFetch from '@/services/use-fetch';
import { useStore } from '@/hooks/useStore';
import { toStatus } from '@/utils/utils';
// import useFetch from '@/services/use-fetch';

const Employment: React.FC = () => {
  const { pageNum, setCurrentPage } = usePagination({ offset: 9, pageNum: 1 });
  const uid = useStore(state => state.uid);

  const { data, isLoading, error } = useFetch(
    uid
      ? {
          url: '/hires/all',
          method: 'GET',
          params: {
            offset: 9,
            pageNum,
            status: 'approved'
          }
        }
      : null
  );

  useEffect(() => {
    if (!isLoading && error) {
      message.error(error);
    }
  }, [isLoading, error]);

  return (
    <div className='flex flex-col justify-between h-full p-4 overflow-auto'>
      <div className='flex flex-row flex-wrap w-full h-5/6 justify-between'>
        {isLoading ? (
          <Spin />
        ) : data?.hires?.length ? (
          data?.hires?.map((item: any) => {
            return (
              <div className='w-[30%] h-[30%]' key={item.content_slice}>
                <Link href={`/normal/employment/${item.hid.toString()}`}>
                  <EmployItem
                    loading={isLoading}
                    title={item.title}
                    desc={item.content_slice}
                    status={toStatus(item.start_time, item.end_time)}
                    companyName={item.ename}
                  />
                </Link>
              </div>
            );
          })
        ) : (
          <div className='w-full h-full flex justify-center'>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>
      <div className='w-full flex justify-end'>
        <Pagination
          onChange={page => setCurrentPage(page)}
          defaultCurrent={pageNum}
          defaultPageSize={9}
          total={data?.allPages || 1}
        />
      </div>
    </div>
  );
};

export default Employment;
