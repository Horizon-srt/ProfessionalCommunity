/* eslint-disable react-hooks/exhaustive-deps */
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
  const [currentLabel, setCurrentLabel] = useState('science');
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();
  const router = useRouter();
  const { offset } = usePagination({
    offset: 10,
    pageNum: 1
  });

  const { data } = useFetch(
    associatedValue === ''
      ? {
          url: '/education/ebook/search/label',
          method: 'GET' as ProvideMethod,
          params: {
            labels: currentLabel,
            offset,
            pageNum: currentPage
          }
        }
      : null
  );

  const { data: data2 } = useFetch(
    associatedValue === ''
      ? null
      : {
          url: '/education/ebook/search/name',
          method: 'GET' as ProvideMethod,
          params: {
            name: associatedValue,
            offset,
            pageNum: currentPage
          }
        }
  );

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
    setCurrentLabel(e.key);
  };

  const [filterparamList, setFilterParamList] = useState([]);

  // 标签搜索

  useEffect(() => {
    if (associatedValue != '') {
      setFilterParamList(data2?.ebooks || []);
    } else {
      setFilterParamList(data?.ebooks || []);
    }
  }, [data, data2]);

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
        selectedKeys={[currentLabel]}
        mode='horizontal'
        items={items}
      />
      <List
        className={styles.list}
        rowKey={(item: any) => item.eid}
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
        renderItem={(item: any) => {
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
