/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Button, Card, Image, Input, List } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import styles from './styles/style.module.css';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import useFetch from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { usePagination } from '@/hooks/usePagination';

const Library: React.FC = () => {
  const [associatedValue, setAssociatedValue] = useState('');
  const [current, setCurrent] = useState('science');
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();
  const router = useRouter();
  const { offset } = usePagination({
    offset: 10,
    pageNum: 1
  });

  const { data } = useFetch({
    url: '/education/ebook/search/label',
    method: 'GET' as ProvideMethod,
    params: {
      current,
      offset,
      currentPage
    }
  });

  const { data: data2 } = useFetch({
    url: '/education/ebook/search/name',
    method: 'GET' as ProvideMethod,
    params: {
      associatedValue,
      offset,
      currentPage
    }
  });

  const list: any[] = [];
  // for (let i = 1; i < 40; i += 1) {
  //   list.push({
  //     bid: i,
  //     name: 'name' + i,
  //     cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
  //     content:
  //       'Umi@4 实战教程，专门针对中后台项目零基础的朋友，不管你是前端还是后端，看完这个系列你也有能力合理“抗雷”，“顶坑”',
  //     description: 'this is a description' + i,
  //     detail: 'this is a detail',
  //     label: ['science', 'literature']
  //   });
  // }

  const items: MenuProps['items'] = [
    {
      label: 'Science',
      key: 'science'
    },
    {
      label: 'Literature',
      key: 'literature'
    },
    {
      label: 'Math',
      key: 'math'
    }
  ];

  const onClick: MenuProps['onClick'] = (e: any) => {
    setAssociatedValue('');
    setCurrent(e.key);
  };

  // 模糊搜索
  // useEffect(() => {
  //   if (associatedValue) {
  //     setFilterParamList([]);
  //     setFilterParamList(
  //       list.filter(item => {
  //         if (
  //           item?.name?.indexOf(associatedValue) !== -1 ||
  //           item?.description?.indexOf(associatedValue) !== -1
  //         ) {
  //           return true;
  //         }
  //         return false;
  //       })
  //     );
  //   } else {
  //     //为空时将渲染原始表格数据
  //     setFilterParamList(list);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [associatedValue]);
  // // 初始数据为data1
  const [filterparamList, setFilterParamList] = useState(list);

  // 标签搜索

  useEffect(() => {
    if (associatedValue != '') {
      setFilterParamList(data2?.ebooks || []);
    } else {
      setFilterParamList(data?.ebooks || []);
    }
  }, [data, data2]);

  // useEffect(() => {
  //   setFilterParamList(data1);
  // }, [data1]);

  return (
    <div className={styles.main}>
      <Input
        className={styles.input}
        value={associatedValue}
        onChange={e => {
          setAssociatedValue(e.target.value?.trim());
        }}
        placeholder='Please enter the book title, author or description to search for books'
        allowClear
      />
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode='horizontal'
        items={items}
      />
      <List
        className={styles.list}
        rowKey='id'
        grid={{
          gutter: 10,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 5,
          xxl: 5
        }}
        pagination={{
          position: 'bottom',
          align: 'center',
          pageSize: 10,
          onChange(page) {
            setCurrentPage(page);
          }
        }}
        dataSource={
          pathname === '/admin/ebook'
            ? [{}, ...filterparamList]
            : [...filterparamList]
        }
        renderItem={item => {
          if (item && item.bid) {
            return (
              <List.Item key={item.bid} style={{ margin: '20px' }}>
                <Card
                  hoverable
                  style={{ width: '100%', height: '80%' }}
                  cover={<Image alt='example' src={item.cover} />}
                  onClick={() => router.push(`ebook/detail/${item.bid}`)}
                >
                  <Card.Meta
                    title={<a>{item.name}</a>}
                    description={item.description}
                  />
                </Card>
              </List.Item>
            );
          }
          return (
            <>
              <div className={styles.buttonFather}>
                <Button
                  className={styles.create}
                  type='dashed'
                  style={{ height: '100%', fontSize: 56 }}
                  onClick={() => router.push('ebook/create')}
                >
                  +
                </Button>
              </div>
              <List.Item></List.Item>
            </>
          );
        }}
      />
    </div>
  );
};

export default Library;
