import React, { useEffect, useState } from 'react';
import { Button, Card, Carousel, Input, List } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './styles/style.module.css';

const Guide: React.FC = () => {
  const router = useRouter();
  const data = Array.from({ length: 23 }).map((_, i) => ({
    bid: i,
    href: 'https://ant.design',
    title: `垃圾分类指南 ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    date: '2024.1.1',
    content: '可回收物主要包括废玻璃、废金属、废塑料、废纸张和废织物五大类。'
  }));
  return (
    <main>
      guide
      <div className={styles.main}>
        <List
          itemLayout='vertical'
          size='large'
          pagination={{
            pageSize: 4
          }}
          dataSource={data}
          renderItem={item => (
            <List.Item
              key={item.title}
              extra={
                <img
                  width={272}
                  alt='logo'
                  src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
                />
              }
              onClick={() => router.push(`guide/detail/${item.bid}`)}
            >
              <List.Item.Meta
                title={<a href={item.href}>{item.title}</a>}
                description={item.date}
              />
              {item.content}
            </List.Item>
          )}
        />
      </div>
    </main>
  );
};

export default Guide;
