import React from 'react';
import '@/styles/global.css'
import global from '@/styles/global.module.css';
import useRotateDeg from '@/hooks/useRotateDeg';

interface DynamicBackgroundProps {
  children: React.ReactNode;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ children }) => {
  const [rotateDeg] = useRotateDeg();

  return (
    <div
      className={global.background}
      style={{ '--rotate-deg': `${rotateDeg}deg` }}
    >
      {children}
    </div>
  );
};

export default DynamicBackground;
