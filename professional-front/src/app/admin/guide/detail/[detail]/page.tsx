/* eslint-disable max-len */
'use client';

import { Carousel, Image } from 'antd';
import styles from './styles/styles.module.css';
import React from 'react';
import { useRouter } from 'next/navigation';
import useFetch from '@/services/use-fetch';

const Detail: React.FC<{ params: { detail: string } }> = ({ params }) => {
  // const { data, isLoading, error } = useFetch({
  //   url: `/guides/${params.detail}`,
  //   method: 'GET',
  //   params: {}
  // });

  const router = useRouter();
  const data = Array.from({ length: 23 }).map((_, i) => ({
    bid: i,
    href: 'https://ant.design',
    title: `Waste sorting guide ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    date: '2024.1.1',
    content: [
      '1. Recyclable materials mainly include five categories: waste glass, waste metal, waste plastic, waste paper and waste fabric. Waste glass: mainly includes various glass bottles, broken glass pieces, thermos bottles, etc. (Mirrors are other garbage/dry garbage) Scrap metal: mainly including cans, cans, etc. Waste plastics: various plastic bags, plastic foam, plastic packaging (express wrapping paper is other garbage/dry garbage), disposable plastic lunch boxes and tableware, hard plastics, plastic toothbrushes, plastic cups, mineral water bottles, etc. Waste paper: mainly includes newspapers, periodicals, books, various packaging papers, etc. However, be aware that paper towels and toilet paper are not recyclable because they are too water-soluble. Waste fabrics: mainly include discarded clothes, tablecloths, face towels, school bags, shoes, etc.',
      '2. Kitchen waste includes leftovers, bones, roots and leaves, peels and other food waste. By processing compost on site through biotechnology, 0.6~0.7 tons of organic fertilizer can be produced per ton.'
    ]
  }));
  const getNextDetail = (detail: number) => {
    return Number(params.detail) + detail <= data.length - 1
      ? Number(params.detail) + detail
      : Number(params.detail) + detail - data.length;
  };

  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <Image
          alt=''
          style={{ objectFit: 'unset' }}
          width={'100%'}
          height={'100%'}
          preview={false}
          src={
            'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
          }
        />
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.title}>{data[Number(params.detail)].title}</h1>
          <h2>
            {data[Number(params.detail)].content.map((paragraph, index) => (
              <div key={index}>
                <p>{paragraph}</p>
              </div>
            ))}
          </h2>
        </div>
        <div className={styles.contentStyle}>
          <Carousel autoplay style={{ width: '25vw', height: '20vh' }}>
            <div onClick={() => router.push(`${getNextDetail(1)}`)}>
              <Image
                alt=''
                width={'25vw'}
                height={'20vh'}
                preview={false}
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${getNextDetail(1)}`}
              />
            </div>
            <div onClick={() => router.push(`${getNextDetail(2)}`)}>
              <Image
                alt=''
                width={'25vw'}
                height={'20vh'}
                preview={false}
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${getNextDetail(2)}`}
              />
            </div>
            <div onClick={() => router.push(`${getNextDetail(3)}`)}>
              <Image
                alt=''
                width={'25vw'}
                height={'20vh'}
                preview={false}
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${getNextDetail(3)}`}
              />
            </div>
            <div onClick={() => router.push(`${getNextDetail(4)}`)}>
              <Image
                alt=''
                width={'25vw'}
                height={'20vh'}
                preview={false}
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${getNextDetail(4)}`}
              />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Detail;
