'use client';
import React from 'react';
import { FloatButton } from 'antd';
import {
  ColumnHeightOutlined,
  MoonOutlined,
  PlusOutlined,
  SunOutlined,
  VerticalAlignMiddleOutlined
} from '@ant-design/icons';
import { useThemeContext } from '@/components/ThemeProvider/themeContext';
import { useStore } from '@/hooks/useStore';

const FloatSwitch: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();
  const switchExpand = useStore(state => state.switchExpand);
  const isExpand = useStore(state => state.userInfoIsExpand);

  // const userType = useStore(state => state.userType);
  const userType = localStorage.getItem('user-type');
  return (
    <FloatButton.Group trigger='hover' type='primary' icon={<PlusOutlined />}>
      <FloatButton
        icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
        onClick={() => toggleTheme && toggleTheme()}
      />
      {userType === 'NORMAL' ? (
        <FloatButton
          icon={
            !isExpand ? (
              <ColumnHeightOutlined />
            ) : (
              <VerticalAlignMiddleOutlined />
            )
          }
          onClick={() => switchExpand()}
        />
      ) : null}
    </FloatButton.Group>
  );
};

export default FloatSwitch;
