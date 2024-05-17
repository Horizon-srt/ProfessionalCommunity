'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import { Button, List, Spin, Tabs, TabsProps, message } from 'antd';
import style from '@/components/ServiceParts/styles/style.module.css';
import { Image } from 'antd';
import { ServiceType } from '@/types/data-types';
import Link from 'next/link';
import useFetch from '@/services/use-fetch';
import { useRouter } from 'next/navigation';
import {
  PlusOutlined,
  ProfileOutlined,
  ShopOutlined,
  ToolOutlined,
  UserOutlined
} from '@ant-design/icons';

interface ServicePartsProps {
  isAdmin: boolean;
}

const ServiceParts: React.FC<ServicePartsProps> = ({ isAdmin }) => {
  const [fixedCurrent, setFixedCurrent] = useState(1);
  const [onDoorCurrent, setOnDoorCurrent] = useState(1);
  const [subscribeCurrent, setSubscribeCurrent] = useState(1);
  const [itemList, setItemList] = useState([] as any);
  const router = useRouter();
  const [userType, setUserType] = useState('TOURIST');

  useEffect(() => {
    setUserType(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  const {
    data: fixedData,
    isLoading: fixedIsLoading,
    error: fixedError
  } = useFetch({
    url: '/services',
    method: 'GET',
    params: {
      type: 'FIXED',
      offset: 4,
      pageNum: fixedCurrent
    }
  });

  const {
    data: onDoorData,
    isLoading: onDoorIsLoading,
    error: onDoorError
  } = useFetch({
    url: '/services',
    method: 'GET',
    params: {
      type: 'ONDOOR',
      offset: 4,
      pageNum: onDoorCurrent
    }
  });

  const {
    data: subscribeData,
    isLoading: subscribeIsLoading,
    error: subscribeError
  } = useFetch({
    url: '/services/subscribe',
    method: 'GET',
    params: {
      offset: 8,
      pageNum: subscribeCurrent
    }
  });

  useEffect(() => {
    if (!fixedIsLoading && fixedError) {
      message.error(fixedError);
    }
    if (!onDoorIsLoading && onDoorError) {
      message.error(onDoorError);
    }
    if (!subscribeIsLoading && subscribeError) {
      message.error(subscribeError);
    }
  }, [
    fixedIsLoading,
    fixedError,
    onDoorIsLoading,
    onDoorError,
    subscribeIsLoading,
    subscribeError
  ]);

  // const fixedFetch = {
  //   data: {
  //     services: [
  //       {
  //         sid: 1,
  //         name: 'string1',
  //         cover:
  //           'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
  //         available: 'string',
  //         detail_slice: 'string'
  //       },
  //       {
  //         sid: 2,
  //         name: 'string2',
  //         cover:
  //           'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
  //         available: 'string',
  //         detail_slice: 'string'
  //       },
  //       {
  //         sid: 3,
  //         name: 'string3',
  //         cover:
  //           'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
  //         available: 'string',
  //         detail_slice: 'string'
  //       },
  //       {
  //         sid: 4,
  //         name: 'string4',
  //         cover:
  //           'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
  //         available: 'string',
  //         detail_slice: 'string'
  //       }
  //     ],
  //     allPages: 10
  //   },
  //   isLoading: false
  // };

  // const onDoorFetch = {
  //   data: {
  //     services: [
  //       {
  //         sid: 11,
  //         name: 'string11',
  //         cover:
  //           'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
  //         available: 'string',
  //         detail_slice: 'string'
  //       },
  //       {
  //         sid: 12,
  //         name: 'string12',
  //         cover:
  //           'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
  //         available: 'string',
  //         detail_slice: 'string'
  //       },
  //       {
  //         sid: 13,
  //         name: 'string13',
  //         cover:
  //           'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
  //         available: 'string',
  //         detail_slice: 'string'
  //       },
  //       {
  //         sid: 14,
  //         name: 'string14',
  //         cover:
  //           'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
  //         available: 'string',
  //         detail_slice: 'string'
  //       }
  //     ],
  //     allPages: 10
  //   },
  //   isLoading: false
  // };

  // const subscribeFetch = {
  //   data: {
  //     services: [
  //       {
  //         srid: '1',
  //         building: 'string;',
  //         unit: 'string;',
  //         room: 'string;',
  //         name: 'Zhang San',
  //         service_name: 'Fix air conditioner',
  //         phone: '13832581023;',
  //         line: '13832581023;',
  //         detail:
  //           'string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;',
  //         time: 'today;'
  //       },
  //       {
  //         srid: '2',
  //         building: 'string;',
  //         unit: 'string;',
  //         room: 'string;',
  //         name: 'string;',
  //         service_name: 'string;',
  //         phone: 'string;',
  //         line: 'string;',
  //         detail: 'string;',
  //         time: 'string;'
  //       },
  //       {
  //         srid: '3',
  //         building: 'string;',
  //         unit: 'string;',
  //         room: 'string;',
  //         name: 'string;',
  //         service_name: 'string;',
  //         phone: 'string;',
  //         line: 'string;',
  //         detail: 'string;',
  //         time: 'string;'
  //       },
  //       {
  //         srid: '4',
  //         building: 'string;',
  //         unit: 'string;',
  //         room: 'string;',
  //         name: 'string;',
  //         service_name: 'string;',
  //         phone: 'string;',
  //         line: 'string;',
  //         detail: 'string;',
  //         time: 'string;'
  //       },
  //       {
  //         srid: '5',
  //         building: 'string;',
  //         unit: 'string;',
  //         room: 'string;',
  //         name: 'string;',
  //         service_name: 'string;',
  //         phone: 'string;',
  //         line: 'string;',
  //         detail: 'string;',
  //         time: 'string;'
  //       },
  //       {
  //         srid: '6',
  //         building: 'string;',
  //         unit: 'string;',
  //         room: 'string;',
  //         name: 'string;',
  //         service_name: 'string;',
  //         phone: 'string;',
  //         line: 'string;',
  //         detail: 'string;',
  //         time: 'string;'
  //       },
  //       {
  //         srid: '7',
  //         building: 'string;',
  //         unit: 'string;',
  //         room: 'string;',
  //         name: 'string;',
  //         service_name: 'string;',
  //         phone: 'string;',
  //         line: 'string;',
  //         detail: 'string;',
  //         time: 'string;'
  //       },
  //       {
  //         srid: '8',
  //         building: 'string;',
  //         unit: 'string;',
  //         room: 'string;',
  //         name: 'string;',
  //         service_name: 'string;',
  //         phone: 'string;',
  //         line: 'string;',
  //         detail: 'string;',
  //         time: 'string;'
  //       }
  //     ],
  //     allPages: 10
  //   },
  //   isLoading: false
  // };

  const ContentList: React.FC<{
    dataList: any;
    type: ServiceType;
    userType: string;
  }> = ({ userType, dataList, type }) => {
    console.log(dataList);
    return (
      <List
        itemLayout='vertical'
        pagination={{
          onChange: page => {
            type === 'FIXED' ? setFixedCurrent(page) : setOnDoorCurrent(page);
          },
          pageSize: 4,
          total:
            type === 'FIXED'
              ? (fixedData?.total_services || 0) * 4
              : (onDoorData?.total_services || 0) * 4
        }}
        dataSource={dataList}
        renderItem={(item: any) => {
          return (
            <Link
              href={
                userType === 'ADMIN'
                  ? `/${userType.toLowerCase()}/service/edit/${item.sid}`
                  : `/${userType.toLowerCase()}/service/${item.sid}`
              }
            >
              <List.Item
                key={item.title}
                extra={
                  // todos
                  <Image src={item.cover} alt={''} width={160} height={100} />
                }
              >
                <List.Item.Meta
                  title={<div>{item.name}</div>}
                  description={<div>{`Status: ${item.description}`}</div>}
                />
                {item.detail_slice}
              </List.Item>
            </Link>
          );
        }}
      />
    );
  };

  const SubscribeList: React.FC<{ userType: string }> = ({ userType }) => {
    return (
      <List
        itemLayout='horizontal'
        pagination={{
          onChange: page => {
            setSubscribeCurrent(page);
          },
          pageSize: 4,
          total: (subscribeData?.total_pages || 1) * 4
        }}
        dataSource={subscribeData?.subscriptions || []}
        renderItem={(item: any) => {
          return (
            // <Link href={`/admin/service/edit/${item.srid}`}>
            <List.Item
              key={item.srid + item.name}
              actions={[
                <Link
                  href={`/admin/service/subscribe/${item.srid}`}
                  key={item.srid + item.name}
                >
                  <Button style={{ color: '#6DC570' }}>View</Button>
                </Link>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <UserOutlined
                    style={{ fontSize: '3rem', color: '#6DC570' }}
                  />
                }
                title={<div>{`${item.name}  -  ${item.service_name}`}</div>}
                description={
                  <div>
                    {item.detail.length > 50
                      ? item.detail
                      : item.detail.slice(0, 50)}
                  </div>
                }
              />
              {item.detail_slice}
            </List.Item>
            // </Link>
          );
        }}
      />
    );
  };

  const items: TabsProps['items'] = [
    {
      key: 'FIXED',
      label: (
        <div id={style.tabTitle}>
          <ShopOutlined style={{ marginRight: '0.5rem' }} />
          Fixed Service
        </div>
      ),
      children: (
        <ContentList
          dataList={fixedData?.services || []}
          type='FIXED'
          userType={userType}
        />
      )
    },
    {
      key: 'ONDOOR',
      label: (
        <div id={style.tabTitle}>
          <ToolOutlined style={{ marginRight: '0.5rem' }} />
          Ondoor Service
        </div>
      ),
      children: (
        <ContentList
          dataList={onDoorData?.services || []}
          type='ONDOOR'
          userType={userType}
        />
      )
    }
  ];

  if (isAdmin) {
    items.push({
      key: 'SUBSCRIBE',
      label: (
        <div id={style.tabTitle}>
          <ProfileOutlined style={{ marginRight: '0.5rem' }} />
          Subscription
        </div>
      ),
      children: <SubscribeList userType={userType} />
    });
    items.push({
      key: 'ADDITION',
      label: (
        <div id={style.tabTitle}>
          <PlusOutlined style={{ marginRight: '0.5rem' }} />
          Service Addition
        </div>
      )
    });
  }

  useEffect(() => {
    setItemList(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedData, onDoorData]);

  return (
    <div className={style.backgoundCard}>
      <Tabs
        defaultActiveKey='FIXED'
        items={itemList}
        onChange={activeKey => {
          if (activeKey === 'ADDITION') router.push('/admin/service/create');
        }}
      />
    </div>
  );
};

export default ServiceParts;
