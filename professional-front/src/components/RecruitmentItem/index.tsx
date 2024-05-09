import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { RecruitStatus } from './RecruitmentStatus';
import { ProvideMethod, RecruitmentStatus } from '@/types/data-types';
import { FilePdfOutlined } from '@ant-design/icons';

interface IRecruitmentInfo {
  hid: string;
  title: string;
  ename: string;
  start_time: string;
  end_time: string;
  content_slice: string;
  status: RecruitmentStatus;
}
export const RecruitItem = ({
  rInfo,
  deleteHire
}: {
  rInfo: IRecruitmentInfo;
  deleteHire: (info: any) => void;
}) => {
  return (
    <div className={'p-3 px-6 flex flex-row justify-between relative'}>
      <div className={'flex flex-row'}>
        <div className='mr-3'>
          <FilePdfOutlined />
        </div>
        <div className='mr-6'>{rInfo.ename}</div>
        <div>{rInfo.title}</div>
      </div>
      <div className='flex flex-row'>
        <div className='mr-3 mt-1'>
          <RecruitStatus status={rInfo.status} />
        </div>
        <Button className='mr-3' style={{ color: 'green' }}>
          Detail
        </Button>
        <Button
          danger
          onClick={() => {
            deleteHire({
              url: `/hire/${rInfo.hid}`,
              method: 'DELETE' as ProvideMethod,
              params: null
            });
          }}
        >
          Delete
        </Button>
      </div>
      <div className='absolute bg-green-500 w-full h-[0.1rem] absolute -left-[0.1rem] top-12'></div>
    </div>
  );
};
