'use client';
import React from 'react';
import { Pagination } from 'antd';
import { EmployItem } from '@/components/EmployItem';

const Employment: React.FC = () => {
  return (
    <div className='flex flex-col justify-between h-full p-4 overflow-auto'>
      <div className='flex flex-row flex-wrap w-full h-5/6 justify-between'>
        <div className='w-[30%] h-[30%]'>
          <EmployItem
            title={'b'}
            desc={'wdwdwddwdwwdwdwddwdwwdwdwddwdwwdwdwddwdwwdwdwddwdw'}
            status={0}
            companyName='h1'
          />
        </div>
        <div className='w-[30%] h-[30%]'>
          <EmployItem
            title={'a'}
            desc={'wdwdwddwdw'}
            status={1}
            companyName='h2h'
          />
        </div>
        <div className='w-[30%] h-[30%]'>
          <EmployItem
            desc={'wdwdwddwdw'}
            status={0}
            companyName='h3h'
            title={'ewfe'}
          />
        </div>
        <div className='w-[30%] h-[30%]'>
          <EmployItem
            desc={'wdwdwddwdw'}
            status={3}
            companyName='aa'
            title={'a'}
          />
        </div>
        <div className='w-[30%] h-[30%]'>
          <EmployItem
            desc={'wdwdwddwdw'}
            status={0}
            companyName='hhh'
            title={'a'}
          />
        </div>
        <div className='w-[30%] h-[33%]'>
          <EmployItem
            desc={'wdwdwddwdw'}
            status={1}
            companyName='hhh'
            title={'a'}
          />
        </div>
        <div className='w-[30%] h-[33%]'>
          <EmployItem
            desc={'wdwdwddwdw'}
            status={0}
            companyName='hhh'
            title={'a'}
          />
        </div>
        <div className='w-[30%] h-[33%]'>
          <EmployItem
            desc={'wdwdwddwdw'}
            status={0}
            companyName='hhh'
            title={'a'}
          />
        </div>
        <div className='w-[30%] h-[33%]'>
          <EmployItem
            desc={'wdwdwddwdw'}
            status={0}
            companyName='hhh'
            title={'a'}
          />
        </div>
      </div>
      <div className='w-full flex justify-end'>
        <Pagination defaultCurrent={1} defaultPageSize={9} total={72} />
      </div>
    </div>
  );
};

export default Employment;
