import React from 'react';
import styles from './styles/style.module.css';
import { Button, Empty, List, Spin } from 'antd';
import { usePagination } from '@/hooks/usePagination';
import useFetch from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';

const ResumeReview: React.FC = () => {
  const list: any[] = [];
  for (let i = 1; i < 40; i += 1) {
    list.push({
      bid: i,
      name: '张三Recruit' + i,
      cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
      title: '招聘摄影师',
      startTime: '2021.1.10',
      endTime: '2022.1.10',
      label: ['待审核']
    });
  }
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
  console.log(data);
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
      ) : data?.resume?.length ? (
        <List
          className={styles.list}
          rowKey='id'
          pagination={{
            position: 'bottom',
            align: 'center',
            pageSize: 7,
            current: pageNum,
            onChange: page => {
              setCurrentPage(page);
            },
            total: (data?.allPages || 1) * 7
          }}
          dataSource={data?.resume || []}
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
                  // <Button key='' type='primary'>
                  //   Accept
                  // </Button>,
                  // <Button key='' type='primary' danger>
                  //   Reject
                  // </Button>
                ]}
              >
                <List.Item.Meta title={item?.name} />
                <div className='flex flex-row justify-center'>
                  <div>{item?.position}</div>
                  <div>{item?.phone}</div>
                  <div>{item?.email}</div>
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
