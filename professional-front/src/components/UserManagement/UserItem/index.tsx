import { Avatar, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { ProvideMethod, RecruitmentStatus } from '@/types/data-types';
import { DeleteOutlined } from '@ant-design/icons';

interface IUserInfo {
  uid: string;
  name: string;
}
export const UserItem = ({ uInfo }: { uInfo: IUserInfo }) => {
  return (
    <div className={`p-3  flex flex-row justify-between relative`}>
      <div className={`flex flex-row`}>
        <div className='mr-3'>
          <Avatar />
        </div>
        <div className='mt-1'>{uInfo.name}</div>
      </div>

      <DeleteOutlined />
      <div className='absolute bg-green-500 w-full h-[0.1rem] absolute -left-[0.1rem] top-12'></div>
    </div>
  );
};
