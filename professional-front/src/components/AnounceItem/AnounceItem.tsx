/* eslint-disable react-hooks/exhaustive-deps */
import { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { RestOutlined } from '@ant-design/icons';
import { message } from 'antd';
import Link from 'next/link';
import React, { useEffect } from 'react';
import styles from '@/components/AnounceItem/styles/style.module.css';

interface IAnounceItem {
  nid: string;
  title: string;
  time: string;
  // 节选，大概几十字
  content_slice: string;
}
export const AnounceItem: React.FC<{
  data: IAnounceItem;
  link: string;
  flasTtrigger: () => void;
}> = ({ data, link, flasTtrigger }) => {
  const [year, month, day] = data.time.split('-');

  const defaultParams = {
    url: `/notifies/${data.nid}`,
    method: 'DELETE' as ProvideMethod,
    params: {}
  };

  // 删除操作
  const {
    trigger,
    isMutating,
    error,
    data: deleteRes
  } = useFetchMutation(defaultParams);

  const handleClick = () => {
    trigger(defaultParams);
  };

  useEffect(() => {
    if (!isMutating && error) {
      message.error(error);
    } else if (!isMutating && deleteRes) {
      message.info('Delete successful!');
    }
  }, [isMutating, error, deleteRes]);

  useEffect(() => {
    if (deleteRes?.nid) {
      flasTtrigger();
    }
  }, [deleteRes]);

  return (
    <div className='w-full flex relative mb-8'>
      <Link href={link} className='flex'>
        <div className='absolute bg-green-500 w-full h-[0.1rem] mt-14'></div>
        <div className='mr-4 flex w-16 flex-col ml-3'>
          <div className='bg-green-500 h-6 text-white text-center'>{day}</div>
          <div className='bg-green-200 h-5 text-xs text-center text-gray-400'>
            {`${year}-${month}`}
          </div>
        </div>
        <div className='mt-3 dark:text-white'>{data.title}</div>
      </Link>
      <div className={styles.restOutlined}>
        {link.split('/')[1] === 'admin' ? (
          <RestOutlined
            className='ml-3 mt-1'
            onClick={handleClick}
            style={{ fontSize: '1rem' }}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
