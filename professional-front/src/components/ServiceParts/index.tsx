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

  const ContentList: React.FC<{
    dataList: any;
    type: ServiceType;
    userType: string;
  }> = ({ userType, dataList, type }) => {
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
              onClick={() => console.log(userType)}
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

  const SubscribeList: React.FC<{ userType: string; data: any }> = ({
    userType,
    data
  }) => {
    const subscribeData = data;

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
      children: <SubscribeList userType={userType} data={subscribeData} />
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
  }, [fixedData, onDoorData, subscribeData]);

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
