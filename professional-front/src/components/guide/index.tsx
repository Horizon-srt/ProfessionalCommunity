import React, { useEffect, useState } from 'react';
import { Image, List, Spin, message } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './styles/style.module.css';
import useFetch from '@/services/use-fetch';

const Guide: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  // const data = Array.from({ length: 23 }).map((_, i) => ({
  //   bid: i,
  //   href: 'https://ant.design',
  //   title: `Waste sorting guide ${i}`,
  //   avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  //   date: '2024.1.1',
  //   content: [
  //     '1. Recyclable materials mainly include five categories: waste glass, \
  //     waste metal, waste plastic, waste paper and waste fabric. Waste glass: \
  //     mainly includes various glass bottles, broken glass pieces, thermos \
  //     bottles, etc. (Mirrors are other garbage/dry garbage) Scrap metal: \
  //     mainly including cans, cans, etc. Waste plastics: various plastic bags, \
  //     plastic foam, plastic packaging (express wrapping paper is other \
  //     garbage/dry garbage), disposable plastic lunch boxes and tableware, \
  //     hard plastics, plastic toothbrushes, plastic cups, mineral water bottles\
  //     , etc. Waste paper: mainly includes newspapers, periodicals, books, \
  //     various packaging papers, etc. However, be aware that paper towels and \
  //     toilet paper are not recyclable because they are too water-soluble. \
  //     Waste fabrics: mainly include discarded clothes, tablecloths, face towels\
  //     , school bags, shoes, etc.',
  //     '2. Kitchen waste includes leftovers, bones, roots and leaves, peels and \
  //     other food waste. By processing compost on site through biotechnology, \
  //     0.6~0.7 tons of organic fertilizer can be produced per ton.'
  //   ]
  // }));

  const { data, isLoading, error } = useFetch({
    url: '/guides',
    method: 'GET',
    params: {
      offset: 4,
      pageNum: currentPage
    }
  });

  useEffect(() => {
    // console.log(data);
    if (!isLoading && error) {
      message.error(error);
    }
  }, [isLoading, error]);

  return (
    <main>
      <div className={styles.main}>
        {isLoading ? (
          <Spin spinning={isLoading} />
        ) : (
          <List
            itemLayout='vertical'
            size='large'
            pagination={{
              current: currentPage,
              onChange: page => setCurrentPage(page),
              pageSize: 4,
              total: (data?.total_pages || 1) * 4
            }}
            dataSource={data?.guides || []}
            renderItem={(item: any) => (
              <List.Item
                key={item.title}
                extra={
                  <Image
                    width={'16rem'}
                    height={'9rem'}
                    alt='logo'
                    // eslint-disable-next-line max-len
                    src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
                  />
                }
                onClick={() => router.push(`guide/detail/${item.gid}`)}
              >
                <List.Item.Meta
                  title={item.title}
                  // title={<a href={item.href}>{item.title}</a>}
                  description={item.date}
                />
                {item.content_slice + '....'}
              </List.Item>
            )}
          />
        )}
      </div>
    </main>
  );
};

export default Guide;
