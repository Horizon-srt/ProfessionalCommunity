/* eslint-disable max-len */
'use client';
import { Carousel, Image, Spin, message } from 'antd';
import styles from './styles/styles.module.css';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useFetch from '@/services/use-fetch';

const Detail: React.FC<{ params: { detail: string } }> = ({ params }) => {
  const { data, isLoading, error } = useFetch({
    url: `/guides/${params.detail}`,
    method: 'GET',
    params: {}
  });

  const {
    data: guideListData,
    isLoading: guideListIsLoading,
    error: guideListError
  } = useFetch({
    url: '/guides',
    method: 'GET',
    params: {
      offset: 4,
      pageNum: 1
    }
  });

  useEffect(() => {
    // console.log(data);
    if (!isLoading && error) {
      message.error(error);
    }
  }, [isLoading, error]);

  useEffect(() => {
    if (!guideListIsLoading && guideListError) {
      message.error(guideListError);
    }
  }, [guideListIsLoading, guideListError]);

  const router = useRouter();
  // const data = Array.from({ length: 23 }).map((_, i) => ({
  //   bid: i,
  //   href: 'https://ant.design',
  //   title: `Waste sorting guide ${i}`,
  //   avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  //   date: '2024.1.1',
  //   content: [
  //     '1. Recyclable materials mainly include five categories: waste glass, waste metal, waste plastic, waste paper and waste fabric. Waste glass: mainly includes various glass bottles, broken glass pieces, thermos bottles, etc. (Mirrors are other garbage/dry garbage) Scrap metal: mainly including cans, cans, etc. Waste plastics: various plastic bags, plastic foam, plastic packaging (express wrapping paper is other garbage/dry garbage), disposable plastic lunch boxes and tableware, hard plastics, plastic toothbrushes, plastic cups, mineral water bottles, etc. Waste paper: mainly includes newspapers, periodicals, books, various packaging papers, etc. However, be aware that paper towels and toilet paper are not recyclable because they are too water-soluble. Waste fabrics: mainly include discarded clothes, tablecloths, face towels, school bags, shoes, etc.',
  //     '2. Kitchen waste includes leftovers, bones, roots and leaves, peels and other food waste. By processing compost on site through biotechnology, 0.6~0.7 tons of organic fertilizer can be produced per ton.'
  //   ]
  // }));
  // const getNextDetail = (detail: number) => {
  //   return Number(params.detail) + detail <= data.length - 1
  //     ? Number(params.detail) + detail
  //     : Number(params.detail) + detail - data.length;
  // };

  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <Image
          alt=''
          style={{ objectFit: 'unset' }}
          width={'100%'}
          height={'100%'}
          preview={false}
          src={data?.cover || <Spin spinning={true} />}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={`${styles.title} text-3xl`}>{data?.title || ''}</h1>
          <div className='italic'>{data?.content || ''}</div>
        </div>
        <div className={styles.contentStyle}>
          {guideListData ? (
            <Carousel autoplay style={{ width: '25vw', height: '50vh' }}>
              {guideListData.guides.map((item: any) => (
                <div
                  key={item.gid}
                  onClick={() => {
                    router.push(`${item.gid}`);
                  }}
                >
                  <Image
                    alt=''
                    width={'25vw'}
                    height={'50vh'}
                    preview={false}
                    src={item.cover}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <Spin spinning={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;

// <div
//   onClick={() => {
//     if (guideListData)
//       router.push(`${guideListData.guides[0].gid}`);
//   }}
// >
//   <Image
//     alt=''
//     width={'25vw'}
//     height={'20vh'}
//     preview={false}
//     src={guideListData?.guides[0]?.cover || ''}
//   />
// </div>
// <div
//   onClick={() => {
//     if (guideListData)
//       router.push(`${guideListData.guides[1].gid}`);
//   }}
// >
//   <Image
//     alt=''
//     width={'25vw'}
//     height={'20vh'}
//     preview={false}
//     src={guideListData?.guides[1]?.cover || ''}
//   />
// </div>
// <div
//   onClick={() => {
//     if (guideListData)
//       router.push(`${guideListData.guides[2].gid}`);
//   }}
// >
//   <Image
//     alt=''
//     width={'25vw'}
//     height={'20vh'}
//     preview={false}
//     src={guideListData?.guides[2]?.cover || ''}
//   />
// </div>
// <div
//   onClick={() => {
//     if (guideListData)
//       router.push(`${guideListData.guides[3].gid}`);
//   }}
// >
//   <Image
//     alt=''
//     width={'25vw'}
//     height={'20vh'}
//     preview={false}
//     src={guideListData?.guides[3]?.cover || ''}
//   />
// </div>
