'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles/style.module.css';
import { Avatar, Button, List, Spin, message } from 'antd';
import { useRouter } from 'next/navigation';
import useFetch from '@/services/use-fetch';

const Tourist: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // const list: any[] = [];
  const { data, isLoading, error } = useFetch({
    url: '/guides',
    method: 'GET',
    params: {
      offset: 7,
      pageNumber: 1
    }
  });

  // for (let i = 1; i < 40; i += 1) {
  //   list.push({
  //     bid: i,
  //     name: '张三Recruit' + i,
  //     cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
  //     title: '招聘摄影师',
  //     startTime: '2021.1.10',
  //     endTime: '2022.1.10',
  //     label: ['待审核']
  //   });
  // }
  // const [filterparamList, setFilterParamList] = useState(list);

  useEffect(() => {
    if (isLoading && error) {
      message.error(error);
    }
  }, [isLoading, error]);

  return (
    <div className={styles.main}>
      <div className='flex flex-row justify-between'>
        <div className='relative'>
          <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]'></div>
          <div style={{ fontSize: '2.5rem' }}>Guide</div>
        </div>
        <div className='relative'>
          <Button
            onClick={() => {
              router.push('guide/create');
            }}
          >
            +
          </Button>
        </div>
      </div>
      <Spin spinning={isLoading} size='large'>
        {isLoading ? (
          <div></div>
        ) : (
          <List
            className={styles.list}
            rowKey='id'
            pagination={{
              position: 'bottom',
              align: 'center',
              pageSize: 7,
              current: currentPage,
              onChange: page => setCurrentPage(page),
              total: (data?.allPages || 1) * 7
            }}
            dataSource={data?.guides || []}
            renderItem={(item: any) => {
              return (
                <List.Item
                  className={styles.listItem}
                  key={item.bid}
                  actions={[
                    <Button
                      key='list-loadmore-edit'
                      type='link'
                      onClick={() => {
                        router.push(`guide/detail/${item.bid}`);
                      }}
                    >
                      Detail
                    </Button>,
                    <Button key='' type='primary' danger>
                      Delete
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.cover} />}
                    title={item.name}
                  />
                  <div>{item.title}</div>
                </List.Item>
              );
            }}
          ></List>
        )}
      </Spin>
    </div>
  );
};

export default Tourist;
