import TopBar from '@/components/Topbar';
import React from 'react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <TopBar />
      {children}
    </>
  );
};

export default AdminLayout;
