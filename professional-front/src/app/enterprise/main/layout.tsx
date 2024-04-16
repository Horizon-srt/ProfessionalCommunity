import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ padding: '1rem' }}>{children}</div>;
};

export default MainLayout;
