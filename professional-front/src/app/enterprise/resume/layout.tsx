import React from 'react';

const ResumeLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <div style={{ padding: '1rem', height: '100%' }}>{children}</div>;
};

export default ResumeLayout;
