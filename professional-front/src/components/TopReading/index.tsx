import React, { useEffect, useState } from 'react';
import { Card, List, Spin } from 'antd';
import Link from 'next/link';
// import useFetch from '@/services/use-fetch';
import style from '@/components/TopReading/styles/style.module.css';
import useFetch from '@/services/use-fetch';

interface ImageCarouselProps {
  width: string;
  height: string;
}

const TopReading: React.FC<ImageCarouselProps> = ({ width, height }) => {
  const [type, setTypes] = useState('TOURIST');
  useEffect(() => {
    setTypes(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  const { data, isLoading } = useFetch({
    url: '/education/ebook/search/recommand',
    method: 'GET',
    params: {
      offset: 6,
      pageNumber: 1
    }
  });

  // const data = {
  //   ebooks: [
  //     {
  //       bid: '1',
  //       name: 'string',
  //       description: 'string',
  //       cover: 'string',
  //       label: 'LabelType'
  //     },
  //     {
  //       bid: '1',
  //       name: 'string',
  //       description: 'string',
  //       cover: 'string',
  //       label: 'LabelType'
  //     },
  //     {
  //       bid: '1',
  //       name: 'string',
  //       description: 'string',
  //       cover: 'string',
  //       label: 'LabelType'
  //     },
  //     {
  //       bid: '1',
  //       name: 'string',
  //       description: 'string',
  //       cover: 'string',
  //       label: 'LabelType'
  //     },
  //     {
  //       bid: '1',
  //       name: 'string',
  //       description: 'string',
  //       cover: 'string',
  //       label: 'LabelType'
  //     },
  //     {
  //       bid: '1',
  //       name: 'string',
  //       description: 'string',
  //       cover: 'string',
  //       label: 'LabelType'
  //     }
  //   ]
  // };

  // const isLoading = false;

  return (
    <Card
      title={<div style={{ fontWeight: 'bold' }}>Popular books</div>}
      extra={
        <Link
          href={`/${type.toLowerCase()}/ebook`}
          style={{ color: '#16A609' }}
        >
          {'More >'}
        </Link>
      }
      style={{
        width: width,
        height: height,
        borderRadius: '20px',
        overflow: 'auto'
      }}
      styles={{ body: { paddingTop: '0px' } }}
    >
      <Spin spinning={isLoading} size='large'>
        {isLoading ? (
          <div></div>
        ) : (
          <List
            dataSource={data?.ebooks || []}
            renderItem={(item: any, index) => {
              return (
                <List.Item
                  actions={[
                    <Link
                      href={`/${type.toLowerCase()}/ebook/detail/${item.bid}`}
                      key={item.bid}
                      style={{ color: 'black' }}
                    >
                      {'Read >'}
                    </Link>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className={style.roundNumber}>{index + 1}</div>
                    }
                    title={item.name}
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Spin>
    </Card>
  );
};

export default TopReading;
