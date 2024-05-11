'use client';
import React, { useEffect, useState } from 'react';
import style from '@/components/Topbar/styles/style.module.css';
import Complogo from '../../../public/complogo.svg';
import { Button } from 'antd';
import Image from 'next/image';
import { userVisibility } from '@/types/data-types';
import Link from 'next/link';
import Avator from '../Avator';
import { usePathname } from 'next/navigation';

const TopBar: React.FC = () => {
  const [current, setCurrent] = useState('main');
  const [type, setType] = useState('TOURIST');
  const [islogined, setIsLogined] = useState(false);
  const [avatorLink, setAvatorLink] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    // console.log(pathname.split('/')[2]);
    setCurrent(pathname.split('/')[2]);
  }, [pathname]);

  useEffect(() => {
    if (islogined) {
      setAvatorLink(localStorage.getItem('user-avator') || '');
    }
  }, [islogined]);

  useEffect(() => {
    setType(localStorage.getItem('user-type') || 'TOURIST');
    const jwt = localStorage.getItem('pt-auth') || '';
    // console.log(jwt);
    if (jwt !== '') {
      setIsLogined(true);
    }
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
      </div>
      <div className={style.rightBox}>
        {islogined ? (
          <Avator link={avatorLink} size={'2rem'} />
        ) : (
          <Link
            href={'/login'}
            style={{ color: '#16A609', textDecoration: 'none' }}
          >
            Login ｜ Register
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopBar;
