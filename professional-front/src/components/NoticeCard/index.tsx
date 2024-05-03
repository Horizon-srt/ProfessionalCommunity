import React, { useEffect, useState } from 'react';
import { Card, List, Spin } from 'antd';
import Link from 'next/link';
// import useFetch from '@/services/use-fetch';
import style from '@/components/NoticeCard/styles/style.module.css';

interface ImageCarouselProps {
  width: string;
  height: string;
}

const NoticeCard: React.FC<ImageCarouselProps> = ({ width, height }) => {
  const [type, setTypes] = useState('TOURIST');
  useEffect(() => {
    setTypes(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  // const { data, isLoading } = useFetch({
  //   url: '/notifies/all',
  //   method: 'GET',
  //   params: {
  //     offset: 4,
  //     pageNumber: 1
  //   }
  // });

  const data = {
    notifies: [
      {
        nid: 'string;',
        title: '关于4月16日12号楼停水',
        time: '2024-4-15',
        // 节选，大概几十字
        content_slice: '关于4月16日12号楼停水关于2月3日社区停...'
      },
      {
        nid: 'string;',
        title: '关于2月3日社区停暖气',
        time: '2024-4-16',
        // 节选，大概几十字
        content_slice: '关于4月16日12号楼停水关于2月3日社区停...'
      },
      {
        nid: 'string;',
        title: '关于1月社区开放社区内线上招聘平台',
        time: '2024-4-17',
        // 节选，大概几十字
        content_slice: '关于4月16日12号楼停水关于2月3日社区停...'
      }
    ],
    allPages: '222'
  };

  const isLoading = false;

  return (
    <Card
      title={<div style={{ fontWeight: 'bold' }}>Notice</div>}
      extra={
        <Link
          href={`/${type.toLowerCase()}/notice`}
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
            dataSource={data.notifies}
            renderItem={(item: any) => {
              return (
                <List.Item
                  actions={[
                    <Link
                      // 链接没确定
                      href={`/${type.toLowerCase()}/notice`}
                      key={item.bid}
                      style={{ color: 'black' }}
                    >
                      {'Read >'}
                    </Link>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div>
                        <div className={style.upRect}>
                          {item.time.split('-')[2]}
                        </div>
                        <div className={style.downRect}>
                          {item.time.split('-')[0] +
                            '-' +
                            item.time.split('-')[1]}
                        </div>
                      </div>
                    }
                    title={
                      <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                    }
                    description={item.content_slice}
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

export default NoticeCard;
