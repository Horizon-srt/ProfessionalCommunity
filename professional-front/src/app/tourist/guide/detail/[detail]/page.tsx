import { Carousel } from 'antd';
import styles from './styles/styles.module.css';
import React from 'react';
import TopBar from '@/components/Topbar';

const Detail: React.FC<{ params: { detail: string } }> = ({ params }) => {
  const data = Array.from({ length: 23 }).map((_, i) => ({
    bid: i,
    href: 'https://ant.design',
    title: `垃圾分类指南 ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    date: '2024.1.1',
    content: '可回收物主要包括废玻璃、废金属、废塑料、废纸张和废织物五大类。'
  }));
  console.log(data[Number(params.detail)]);

  return (
    <div>
      <div className={styles.main}>
        <Carousel autoplay>
          <div>
            <h3 className={styles.contentStyle}>1</h3>
          </div>
          <div>
            <h3 className={styles.contentStyle}>2</h3>
          </div>
          <div>
            <h3 className={styles.contentStyle}>3</h3>
          </div>
          <div>
            <h3 className={styles.contentStyle}>4</h3>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Detail;
