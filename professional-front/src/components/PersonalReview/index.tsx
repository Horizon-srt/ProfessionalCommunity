import React, { useEffect, useState } from 'react';
import styles from './styles/style.module.css';
import { Avatar, Button, List, Menu, MenuProps, message } from 'antd';
import { useRouter } from 'next/navigation';
import { usePagination } from '@/hooks/usePagination';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';

const PersonalReview: React.FC = () => {
  const [current, setCurrent] = useState<'0' | '1'>('1');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState<'profile' | 'recruit'>(
    'profile'
  );
  const { offset } = usePagination({
    offset: 10,
    pageNum: 1
  });
  const router = useRouter();
  // const list: any[] = [];
  // for (let i = 1; i < 10; i += 1) {
  //   list.push({
  //     hid: i,
  //     name: '张三Profile' + i,
  //     cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
  //     building: '14号楼',
  //     unit: '1单元',
  //     room: '323室',
  //     label: ['0']
  //   });
  // }
  // const [filterparamList, setFilterParamList] = useState(list);
  const [filterparamList, setFilterParamList] = useState([]);

  const defaultUserAcceptParams = {
    url: '/users',
    method: 'PATCH' as ProvideMethod,
    params: {}
  };
  const defaultHireAcceptParams = {
    url: '/hires',
    method: 'PATCH' as ProvideMethod,
    params: {}
  };
  const { data, trigger: AcceptUser } = useFetchMutation(
    defaultUserAcceptParams
  );
  const { data: data2, trigger: AcceptHire } = useFetchMutation(
    defaultHireAcceptParams
  );

  useEffect(() => {
    if (data) {
      message.success(data?.message);
    }
  }, [data]);

  useEffect(() => {
    if (data2) {
      message.success(data2?.message);
    }
  }, [data2]);

  const { data: dataList } = useFetch(
    currentData === 'profile'
      ? {
          url: '/users/review',
          method: 'GET' as ProvideMethod,
          params: {
            filter: current,
            offset,
            pageNum: currentPage
          }
        }
      : {
          url: '/hires/review',
          method: 'GET' as ProvideMethod,
          params: {
            filter: current,
            offset,
            pageNum: currentPage
          }
        }
  );

  const onClickMenu: MenuProps['onClick'] = (e: any) => {
    setCurrent(e.key);
  };
  console.log(data + ' data');
  const items: MenuProps['items'] = [
    {
      label: 'pending',
      key: '1'
    },
    {
      label: 'audited',
      key: '0'
    }
  ];

  useEffect(() => {
    if (currentData === 'profile') {
      setFilterParamList(dataList?.users || []);
    } else {
      setFilterParamList(dataList?.hires || []);
    }
  }, [currentData, data, current]);

  return (
    <div className={styles.main}>
      <Menu
        onClick={onClickMenu}
        selectedKeys={[current]}
        mode='horizontal'
        items={items}
      />
      <div className={styles.buttonContainer}>
        <Button
          type={currentData === 'profile' ? 'primary' : 'default'}
          className={styles.customButton}
          onClick={() => {
            setCurrentData('profile');
          }}
        >
          Profile
        </Button>
        <Button
          type={currentData === 'recruit' ? 'primary' : 'default'}
          className={styles.customButton}
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
        pagination={{
          position: 'bottom',
          align: 'center',
          pageSize: 7,
          onChange(page) {
            setCurrentPage(page);
          }
        }}
        dataSource={[...filterparamList]}
        renderItem={(item: any) => {
          return (
            <List.Item
              className={styles.listItem}
              key={item.hid}
              actions={
                current === '1'
                  ? [
                      <Button
                        key='detail'
                        type='link'
                        onClick={() => {
                          currentData === 'profile'
                            ? router.push(`review/profile/${item.uid}`)
                            : router.push(`review/recruit/${item.hid}`);
                        }}
                      >
                        Detail
                      </Button>,
                      <Button
                        key='accept'
                        type='primary'
                        onClick={() => {
                          currentData === 'profile'
                            ? AcceptUser({
                                ...defaultUserAcceptParams,
                                ...{
                                  url: `/users/${item.uid}`,
                                  params: { status: 'approved' }
                                }
                              })
                            : AcceptHire({
                                ...defaultHireAcceptParams,
                                ...{
                                  url: `/hires/${item.hid}`,
                                  params: { status: 'approved' }
                                }
                              });
                        }}
                      >
                        Accept
                      </Button>,
                      <Button
                        key='reject'
                        type='primary'
                        danger
                        onClick={() => {
                          currentData === 'profile'
                            ? router.push(`review/profileReject/${item.uid}`)
                            : router.push(`review/recruitReject/${item.hid}`);
                        }}
                      >
                        Reject
                      </Button>
                    ]
                  : [
                      <Button
                        key='detail'
                        type='link'
                        onClick={() => {
                          currentData === 'profile'
                            ? router.push(`review/profile/${item.uid}`)
                            : router.push(`review/recruit/${item.hid}`);
                        }}
                      >
                        Detail
                      </Button>
                    ]
              }
            >
              <List.Item.Meta
                avatar={<Avatar size={80} src={item.cover} />}
                title={
                  <div className={styles.verticalCenter}>
                    {currentData === 'profile' ? item.name : item.ename}
                  </div>
                }
              />
              <div className={styles.locationText}>
                {currentData === 'profile'
                  ? item.building + item.unit + item.room
                  : item.title}
              </div>
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
};

export default PersonalReview;
