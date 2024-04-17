import SideBar from '@/components/SideBar';
import TopBar from '@/components/Topbar';
import React from 'react';

const NormalLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <>
      <TopBar />
      <div className='flex flex-row'>
        <div className='w-2/3  h-[calc(100vh-3rem)]'>{children}</div>
        <div className='w-1/3 h-[calc(100vh-3rem)]'>
          <SideBar></SideBar>
        </div>
      </div>
    </>
  );
};

export default NormalLayout;
