import TopBar from '@/components/Topbar';
import React from 'react';

const TouristLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <>
      <TopBar />
      {children}
    </>
  );
};

export default TouristLayout;
