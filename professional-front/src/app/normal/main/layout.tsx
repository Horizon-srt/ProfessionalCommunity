import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ padding: '0px' }}>{children}</div>;
};

export default MainLayout;
