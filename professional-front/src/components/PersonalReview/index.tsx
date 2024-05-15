import React, { useEffect, useState } from 'react';
import styles from './styles/style.module.css';
import { Avatar, Button, List, Menu, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

const PersonalReview: React.FC = () => {
  const [currentData, setCurrentData] = useState<'profile' | 'recruit'>(
    'profile'
  );
  const router = useRouter();
  const list: any[] = [];
  for (let i = 1; i < 40; i += 1) {
    list.push({
      bid: i,
      name: '张三Profile' + i,
      cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
      building: '14号楼',
      unit: '1单元',
      location: '323室',
      label: ['待审核']
    });
  }
  list.push({
    bid: 999,
    name: '已审核的张三',
    cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
    building: '14号楼',
    unit: '1单元',
    location: '323室',
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
      <div>
        <Button
          onClick={() => {
            setCurrentData('profile');
          }}
        >
          Profile
        </Button>
        <Button
          onClick={() => {
            setCurrentData('recruit');
          }}
        >
          Recruit
        </Button>
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
                  key=''
                  type='link'
                  onClick={() => {
                    currentData === 'profile'
                      ? router.push(`review/profile/${item.bid}`)
                      : router.push(`review/recruit/${item.bid}`);
                  }}
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
              <div>{item.building + item.unit + item.location}</div>
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
};

export default PersonalReview;
