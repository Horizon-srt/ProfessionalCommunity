import React from 'react';

const ServiceLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div
      style={{
        padding: '1rem 5rem',
        height: '90%',
        width: '60%'
      }}
    >
      {children}
    </div>
  );
};

export default ServiceLayout;
