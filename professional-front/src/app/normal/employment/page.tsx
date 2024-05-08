'use client';
import React, { useState } from 'react';
import { Pagination, Spin } from 'antd';
import { EmployItem } from '@/components/EmployItem';
import Link from 'next/link';
// import useFetch from '@/services/use-fetch';

const Employment: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // const { data, isLoading, error } = useFetch({
  //   url: '/hires/all',
  //   method: 'GET',
  //   params: {
  //     offset: currentPage,
  //     pageNum: 9
  //   }
  // });

  const isLoading = false;
  const error = '';
  const data = {
    hires: [
      {
        hid: 1,
        title: 'string;',
        ename: 'string;',
        start_time: 'string;',
        end_time: 'string;',
        // 节选
        content_slice: 'string;',
        status: 'string;'
      },
      {
        hid: 2,
        title: 'string;',
        ename: 'string;',
        start_time: 'string;',
        end_time: 'string;',
        // 节选
        content_slice: 'string;',
        status: 'string;'
      },
      {
        hid: 3,
        title: 'string;',
        ename: 'string;',
        start_time: 'string;',
        end_time: 'string;',
        // 节选
        content_slice: 'string;',
        status: 'string;'
      },
      {
        hid: 4,
        title: 'string;',
        ename: 'string;',
        start_time: 'string;',
        end_time: 'string;',
        // 节选
        content_slice: 'string;',
        status: 'string;'
      },
      {
        hid: 5,
        title: 'string;',
        ename: 'string;',
        start_time: 'string;',
        end_time: 'string;',
        // 节选
        content_slice: 'string;',
        status: 'string;'
      },
      {
        hid: 6,
        title: 'string;',
        ename: 'string;',
        start_time: 'string;',
        end_time: 'string;',
        // 节选
        content_slice: 'string;',
        status: 'string;'
      },
      {
        hid: 7,
        title: 'string;',
        ename: 'string;',
        start_time: 'string;',
        end_time: 'string;',
        // 节选
        content_slice: 'string;',
        status: 'string;'
      },
      {
        hid: 8,
        title: 'string;',
        ename: 'string;',
        start_time: 'string;',
        end_time: 'string;',
        // 节选
        content_slice: 'string;',
        status: 'string;'
      },
      {
        hid: 9,
        title: 'string;',
        ename: 'string;',
        start_time: 'string;',
        end_time: 'string;',
        // 节选
        content_slice: 'string;',
        status: 'string;'
      }
    ],
    allPages: 10
  };

  // TODO: 根据 starttime 和 endtime 确定是否还在招聘
  //    0: 正在招聘
  //    1: 未开始
  //    2: 已结束
  const toStatus = (startTime: string, endTime: string) => {
    console.log(startTime, endTime);
    return 0;
  };

  return (
    <div className='flex flex-col justify-between h-full p-4 overflow-auto'>
      <div className='flex flex-row flex-wrap w-full h-5/6 justify-between'>
        {isLoading || error ? (
          <Spin />
        ) : (
          data.hires?.map((item: any) => {
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
        )}
      </div>
      <div className='w-full flex justify-end'>
        <Pagination
          onChange={page => setCurrentPage(page)}
          defaultCurrent={currentPage}
          defaultPageSize={9}
          total={isLoading || error ? 1 : data.allPages}
        />
      </div>
    </div>
  );
};

export default Employment;
