import React from 'react';
import Card from '../Card';
import { Spin } from 'antd';

interface IEmployItem {
  title: string;
  desc: string;
  status: number;
  companyName: string;
  loading: boolean;
}
export const EmployItem = ({
  title,
  desc,
  status,
  companyName,
  loading
}: IEmployItem) => {
  return (
    <Card>
      <div className='flex flex-col w-full text-xs justify-between'>
        <Spin spinning={loading}>
          <div className='flex flex-row justify-between w-full'>
            <div className='text-sm font-bold'>{title}</div>
            {status === 0 ? (
              <div className='text-green-400'>status:recruiting</div>
            ) : status === 1 ? (
              <div className='text-red-400'>status:stop</div>
            ) : (
              <div className='text-gray-400'>status：Not started</div>
            )}
          </div>
          <p className='w-full text-gray-500'>
            Recruitment time：2024.4.10 - 2024.4.21
          </p>
          <p className='w-full text-gray-300 truncate'>{desc}</p>
          <div className='w-full flex justify-end font-bold'>{companyName}</div>
        </Spin>
      </div>
    </Card>
  );
};
