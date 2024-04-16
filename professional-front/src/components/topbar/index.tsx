'use client';
// import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import style from '@/components/Topbar/styles/style.module.css';
import Complogo from '../../../public/complogo.svg';
import { Button } from 'antd';
import Image from 'next/image';
import { userVisibility } from '@/types/data-types';
import Link from 'next/link';

const TopBar: React.FC = () => {
  // const pathName = usePathname();
  // const type = window.localStorage.getItem('user-type') || 'TOURIST';
  const [current, setCurrent] = useState('main');
  const [type, setType] = useState('TOURIST');

  useEffect(() => {
    setType(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  const MenuItem: React.FC<{ label: string; part: string }> = ({
    label,
    part
  }) => {
    return (
      <div className={style.menuItem}>
        <Link
          href={`/${type.toLowerCase()}/${part}`}
          className={style.linkItem}
        >
          <Button
            type='primary'
            className={
              current === part
                ? style.selectedMenuItemButton
                : style.menuItemButton
            }
            onClick={() => {
              setCurrent(part);
            }}
          >
            {label}
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <div className={style.backgroundBox}>
      <div className={style.leftBox}>
        <Image src={Complogo} alt={''} className={style.imageBox} />
        {userVisibility[type].map((value: string) => {
          return (
            <MenuItem
              label={value.toLocaleUpperCase()}
              part={value}
              key={value}
            />
          );
        })}
        {/* <MenuItem label='aaa' part='ddd' /> */}
      </div>
      <div className={style.rightBox}>
        <Link href={'/login'}>Login ｜ Register</Link>
      </div>
    </div>
  );
};

export default TopBar;
