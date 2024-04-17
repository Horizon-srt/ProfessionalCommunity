/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { List, Spin, Tabs, TabsProps } from 'antd';
import style from '@/components/ServiceParts/styles/style.module.css';
import { Image } from 'antd';
// import useFetch from '@/services/use-fetch';
import { ServiceType } from '@/types/data-types';
import Link from 'next/link';

interface ServicePartsProps {
  isAdmin: boolean;
}

const ServiceParts: React.FC<ServicePartsProps> = ({ isAdmin }) => {
  const [fixedCurrent, setFixedCurrent] = useState(1);
  const [onDoorCurrent, setOnDoorCurrent] = useState(1);
  const [itemList, setItemList] = useState([] as any);
  const [userType, setUserType] = useState('TOURIST');

  useEffect(() => {
    setUserType(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  // const fixedFetch = useFetch({
  //   url: '/services',
  //   method: 'GET',
  //   params: {
  //     type: 'FIXED',
  //     offset: 4,
  //     pageNum: fixedCurrent
  //   }
  // });

  // const onDoorFetch = useFetch({
  //   url: '/services',
  //   method: 'GET',
  //   params: {
  //     type: 'ONDOOR',
  //     offset: 4,
  //     pageNum: onDoorCurrent
  //   }
  // });

  const fixedFetch = {
    data: {
      services: [
        {
          sid: 1,
          name: 'string1',
          cover:
            'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
          available: 'string',
          detail_slice: 'string'
        },
        {
          sid: 2,
          name: 'string2',
          cover:
            'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
          available: 'string',
          detail_slice: 'string'
        },
        {
          sid: 3,
          name: 'string3',
          cover:
            'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
          available: 'string',
          detail_slice: 'string'
        },
        {
          sid: 4,
          name: 'string4',
          cover:
            'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
          available: 'string',
          detail_slice: 'string'
        }
      ],
      allPages: 10
    },
    isLoading: false
  };

  const onDoorFetch = {
    data: {
      services: [
        {
          sid: 11,
          name: 'string11',
          cover:
            'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
          available: 'string',
          detail_slice: 'string'
        },
        {
          sid: 12,
          name: 'string12',
          cover:
            'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
          available: 'string',
          detail_slice: 'string'
        },
        {
          sid: 13,
          name: 'string13',
          cover:
            'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
          available: 'string',
          detail_slice: 'string'
        },
        {
          sid: 14,
          name: 'string14',
          cover:
            'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
          available: 'string',
          detail_slice: 'string'
        }
      ],
      allPages: 10
    },
    isLoading: false
  };

  const ContentList: React.FC<{ dataList: any; type: ServiceType }> = ({
    dataList,
    type
  }) => {
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
              ? fixedFetch.data.allPages * 4
              : onDoorFetch.data.allPages * 4
        }}
        dataSource={dataList}
        renderItem={(item: any) => {
          return (
            <Link href={`/${userType.toLowerCase()}/service/${item.sid}`}>
              <List.Item
                key={item.title}
                extra={
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

  const items: TabsProps['items'] = [
    {
      key: 'FIXED',
      label: <div id={style.tabTitle}>Fixed Service</div>,
      children: (
        <Spin spinning={fixedFetch.isLoading} size='large'>
          {fixedFetch.isLoading ? (
            <div></div>
          ) : (
            <ContentList dataList={fixedFetch.data.services} type='FIXED' />
          )}
        </Spin>
      )
    },
    {
      key: 'ONDOOR',
      label: <div id={style.tabTitle}>Ondoor Service</div>,
      children: (
        <Spin spinning={fixedFetch.isLoading} size='large'>
          {fixedFetch.isLoading ? (
            <div></div>
          ) : (
            <ContentList dataList={onDoorFetch.data.services} type='ONDOOR' />
          )}
        </Spin>
      )
    }
  ];

  if (isAdmin) {
    items.push({
      key: 'ADDITION',
      label: <div id={style.tabTitle}>Service Addition</div>,
      children: 'Content of Tab Pane 3'
    });
  }

  useEffect(() => {
    setItemList(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   console.log(isAdmin);
  //   if (isAdmin) {
  //     items.push({
  //       key: 'ADDITION',
  //       label: <div id={style.tabTitle}>Service Addition</div>,
  //       children: 'Content of Tab Pane 3'
  //     });
  //   }
  // }, []);

  return (
    <div className={style.backgoundCard}>
      <Tabs defaultActiveKey='FIXED' items={itemList} />
    </div>
  );
};

export default ServiceParts;
