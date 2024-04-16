'use client';
import React from 'react';
import { FloatButton } from 'antd';
import { MoonOutlined, PlusOutlined, SunOutlined } from '@ant-design/icons';
import { useThemeContext } from '@/components/ThemeProvider/themeContext';

const FloatSwitch: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <FloatButton.Group trigger='hover' type='primary' icon={<PlusOutlined />}>
      <FloatButton
        icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
        onClick={() => toggleTheme && toggleTheme()}
      />
    </FloatButton.Group>
  );
};

export default FloatSwitch;
