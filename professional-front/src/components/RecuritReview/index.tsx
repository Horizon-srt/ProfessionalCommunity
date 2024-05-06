import React, { useEffect, useState } from 'react';
import styles from './styles/style.module.css';
import { Avatar, Button, List, Menu, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

const RecruitReview: React.FC = () => {
  const router = useRouter();
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
  list.push({
    bid: 999,
    name: '已审核的张三',
    cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
    title: '招聘摄影师',
    startTime: '2021.1.10',
    endTime: '2022.1.10',
    label: ['已审核']
  });
  const [filterparamList, setFilterParamList] = useState(list);
  const [current, setCurrent] = useState('待审核');
  const onClick: MenuProps['onClick'] = (e: any) => {
    setCurrent(e.key);
  };
  const items: MenuProps['items'] = [
    {
      label: '待审核',
      key: '待审核'
    },
    {
      label: '已审核',
      key: '已审核'
    }
  ];

  useEffect(() => {
    if (current) {
      setFilterParamList([]);
      setFilterParamList(
        list.filter(item => {
          if (item?.label.includes(current)) {
            return true;
          }
          return false;
        })
      );
    } else {
      //为空时将渲染原始表格数据
      setFilterParamList(list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);
  return (
    <div className={styles.main}>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode='horizontal'
        items={items}
      />
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
                  onClick={() => router.push(`review/recruit/${item.bid}`)}
                >
                  Detail
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

export default RecruitReview;
