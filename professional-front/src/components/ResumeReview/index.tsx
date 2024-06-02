'use client';
import React from 'react';
import styles from './styles/style.module.css';
import { Button, Empty, List, Spin } from 'antd';
import { usePagination } from '@/hooks/usePagination';
import useFetch from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';

const ResumeReview: React.FC = () => {
  // const list: any[] = [];
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
  const frontDownload = (content: string) => {
    const a = document.createElement('a');
    a.href = content;
    a.download = content;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const { pageNum, setCurrentPage } = usePagination({ offset: 7, pageNum: 1 });

  const { data, isLoading } = useFetch({
    url: '/resume/all',
    method: 'GET' as ProvideMethod,
    params: {
      offset: 7,
      pageNum
    }
  });

  return (
    <div className={styles.main} style={{ overflow: 'auto' }}>
      <div className='flex flex-row justify-between'>
        <div className='relative'>
          <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]'></div>
          <div style={{ fontSize: '2.5rem' }}>Receive Resume</div>
        </div>
      </div>
      {isLoading ? (
        <Spin />
      ) : data?.resumes?.length ? (
        <List
          className={styles.list}
          rowKey='id'
          pagination={{
            current: pageNum,
            onChange: page => setCurrentPage(page),
            pageSize: 4,
            total: (data?.total_pages || 1) * 4
          }}
          // pagination={{
          //   position: 'bottom',
          //   align: 'center',
          //   pageSize: 7,
          //   current: pageNum,
          //   onChange: page => {
          //     setCurrentPage(page);
          //   },
          //   total: (data?.allPages || 1) * 7
          // }}
          dataSource={data?.resumes || []}
          renderItem={(item: any) => {
            return (
              <List.Item
                className={styles.listItem}
                key={item?.bid || ''}
                actions={[
                  <Button
                    key='list-loadmore-edit'
                    type='link'
                    onClick={() => {
                      frontDownload(item?.content);
                    }}
                  >
                    Download
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={<div style={{ fontSize: 'large' }}>{item?.name}</div>}
                />
                <div className='flex flex-row justify-center'>
                  <div style={{ padding: '2rem' }}>{item?.position}</div>
                  <div style={{ padding: '2rem' }}>{item?.phone}</div>
                  <div style={{ padding: '2rem' }}>{item?.email}</div>
                </div>
              </List.Item>
            );
          }}
        ></List>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default ResumeReview;
