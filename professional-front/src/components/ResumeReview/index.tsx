import React, { useEffect, useState } from 'react';
import styles from './styles/style.module.css';
import { Avatar, Button, List, Menu, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

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
  const [filterparamList, setFilterParamList] = useState(list);
  const frontDownload = () => {
    const a = document.createElement('a');
    a.href = '/01a-Trees-2.pdf';
    a.download = '01a-Trees-2.pdf';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={styles.main}>
      <div className='flex flex-row justify-between'>
        <div className='relative'>
          <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]'></div>
          <div style={{ fontSize: '2.5rem' }}>Receive Recruitment</div>
        </div>
      </div>
      <List
        className={styles.list}
        rowKey='id'
        pagination={{ position: 'bottom', align: 'center', pageSize: 7 }}
        dataSource={[...filterparamList]}
        renderItem={item => {
          return (
            <List.Item
              className={styles.listItem}
              key={item.bid}
              actions={[
                <Button
                  key='list-loadmore-edit'
                  type='link'
                  onClick={() => {
                    frontDownload();
                  }}
                >
                  Download
                </Button>,
                <Button key='' type='primary'>
                  Accept
                </Button>,
                <Button key='' type='primary' danger>
                  Reject
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
    </div>
  );
};

export default ResumeReview;
