import React from 'react';
import Image from 'next/image';
import style from '@/components/Avator/styles/style.module.css';
import { SmileOutlined } from '@ant-design/icons';

interface AvatorProps {
  link: string;
  size: string;
}

const Avator: React.FC<AvatorProps> = ({ link, size }) => {
  return (
    <div className={style.avatar} style={{ width: size, height: size }}>
      {link === '' ? <SmileOutlined /> : <Image src={link} alt='Avatar' />}
    </div>
  );
};

export default Avator;
