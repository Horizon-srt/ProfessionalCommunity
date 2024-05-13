import React, { useState } from 'react';
import { ThemeContext } from '@/components/ThemeProvider/themeContext';
import { ConfigProvider, ConfigProviderProps, theme } from 'antd';
import useTheme from '@/hooks/useTheme';
import enUS from 'antd/locale/en_US';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider(props: ThemeProviderProps) {
  type Locale = ConfigProviderProps['locale'];
  const [locale, setLocal] = useState<Locale>(enUS);
  const [value, toggleTheme] = useTheme();

  return (
    <ThemeContext.Provider value={{ theme: value, toggleTheme }}>
      <ConfigProvider
        locale={locale}
        theme={{
          algorithm:
            value === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}
      >
        {props.children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
