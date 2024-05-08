'use client';

import React from 'react';
import AssistantCard from '@/components/AssistantCard';
import UserInfoCard from '@/components/UserInfoCard';
import { UserManagement } from '../UserManagement';
import { useStore } from '@/hooks/useStore';

const SideBar: React.FC = () => {
  const userType = useStore(state => state.userType);
  return true ? (
    // return userType === 'ENTERPRISE' ? (
    <UserManagement />
  ) : (
    <div className='flex flex-col h-full justify-between'>
      {/* <div className='h-40 p-3 h-1/6'>
        <Card title='Personal'>
          <div className='flex flex-row w-full bg-white dark:bg-black h-8'>
            <div className='w-3/12'>
              <Avatar />
            </div>
            <div className='w-9/12 flex flex-col'>
              <div className='text-base text-right font-bold'>San Zhang</div>
              <div className='text-sm text-right text-gray-400'>
                Owner of Room 323, Unit 1, No. 14
              </div>
              <Divider />
            </div>
          </div>
        </Card>
      </div> */}
      <UserInfoCard />
      <AssistantCard />
    </div>
  );
};

export default SideBar;
