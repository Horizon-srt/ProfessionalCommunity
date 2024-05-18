/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Card from '@/components/Card';
import React from 'react';
import Image from 'next/image';
import img from '@/../public/next.svg';
import { Button } from 'antd';
import useFetch from '@/services/use-fetch';
import styles from './styles/styles.module.css';

const Detail: React.FC<{ params: any }> = ({ params }) => {
  const { data, isLoading, error } = useFetch({
    url: `/education/ebook/${params.bid}`,
    method: 'GET',
    params: {}
  });

  const lineStyle = `
    w-1/2 relative inline-block before:block
    before:absolute before:w-full
     before:h-[2px] before:bg-green-500
     before:top-6
  `;
  const bulletStyle = `
  before:h-5
  before:z-0
  before:w-5
  before:top-0
  before:rounded-full
  before:block
  before:absolute before:-inset-1  before:bg-green-200 relative inline-block

  `;

  const frontDownload = () => {
    if (isLoading) return;
    const a = document.createElement('a');
    a.href = data?.file || '';
    a.download = data?.file || '';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div className={styles.main}>
      <Card>
        <div className='flex flex-col w-full h-full mx-[3%]'>
          <div className='h-full w-full p-8 flex flex-row'>
            <Image alt='' src={img} width={200} height={300} className='h-32' />
            <div className='ml-8 p-4'>
              <div className='font-bold mb-3 text-2xl'>
                {' '}
                {data?.name || 'loading...'}
              </div>
              <div className='flex flex-col text-gray-400 text-2xl'>
                <div>Label: {data?.label || 'loading...'}</div>
                <div>Author: {data?.author || 'loading...'}</div>
                <div>Introduction: {data?.detail || 'loading...'}</div>
              </div>
              <Button
                className={styles.download}
                onClick={() => {
                  frontDownload();
                }}
              >
                <div className='text-green-500'>download</div>
              </Button>
            </div>
          </div>
          <div className='w-full h-full flex flex-row'>
            <div className='w-1/2 flex flex-col'>
              {[
                {
                  id: '1',
                  content: 'aaa'
                }
              ]
                .slice(0, 1)
                .map(item => (
                  <li
                    key={item.id}
                    className={lineStyle + ' flex flex-row mb-2 mt-1'}
                  >
                    <div
                      className={
                        'mr-3 text-green-500 relative w-[2%]' + bulletStyle
                      }
                    >
                      <div className='text-sm absolute z-10'>{item.id}</div>
                    </div>
                    <div className='ml-4 text-xl'>{item.content}</div>
                  </li>
                ))}
            </div>
            <div className='w-1/2 flex flex-col'>
              {[
                {
                  id: '1',
                  content: 'aaa'
                }
              ]
                .slice(0, 1)
                .map(item => (
                  <li
                    key={item.id}
                    className={lineStyle + ' flex flex-row mb-2 mt-1'}
                  >
                    <div
                      className={
                        'mr-3 text-green-500 relative w-[2%]' + bulletStyle
                      }
                    >
                      <div className='text-sm absolute z-10'>{item.id}</div>
                    </div>
                    <div className='ml-4 text-xl'>{item.content}</div>
                  </li>
                ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Detail;
