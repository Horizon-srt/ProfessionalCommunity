import SideBar from '@/components/SideBar';
import TopBar from '@/components/topbar';
import React from 'react';

const NormalLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <>
      <TopBar />
      <div className='flex flex-row'>
        <div className='basis-2/3  h-[calc(100vh-3rem)]'>{children}</div>
        <div className='basis-1/3 h-[calc(100vh-3rem)] p-2'>
          <SideBar></SideBar>
        </div>
      </div>
    </>
  );
};

export default NormalLayout;
