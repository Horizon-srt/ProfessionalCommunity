'use client';
import React, { useEffect, useState } from 'react';
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
import { UserType } from '@/types/data-types';

const FloatSwitch = ({ outsideUserType }: { outsideUserType: UserType }) => {
  const { theme, toggleTheme } = useThemeContext();
  const switchExpand = useStore(state => state.switchExpand);
  const isExpand = useStore(state => state.userInfoIsExpand);

  const setStoreUserType = useStore(state => state.setUserType);
  useEffect(() => {
    const currentUserType = localStorage.getItem('user-type') || 'TOURIST';
    setStoreUserType(currentUserType as UserType);
  }, []);

  return (
    <FloatButton.Group trigger='hover' type='primary' icon={<PlusOutlined />}>
      <FloatButton
        icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
        onClick={() => toggleTheme && toggleTheme()}
      />
      {outsideUserType === 'NORMAL' ? (
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
