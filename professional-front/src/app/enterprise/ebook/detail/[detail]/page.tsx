/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Card from '@/components/Card';
import React from 'react';
import Image from 'next/image';
import img from '@/../public/next.svg';
import { Button } from 'antd';

const Detail: React.FC<{ params: { detail: string } }> = ({ params }) => {
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

  const list: any = {
    bid: 1,
    name: '《人间失格》',
    label: '外国文学',
    author: '太宰治',
    introduction: 'bla bla bla',
    section: []
  };
  for (let i = 1; i < 15; i += 1) {
    list.section.push({
      id: i,
      level: 1,
      content: '章节' + i
    });
  }
  const frontDownload = () => {
    const a = document.createElement('a');
    a.href = '/84800_React进阶之路_徐超.epub';
    a.download = '84800_React进阶之路_徐超.epub';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div className='w-full h-full'>
      <Card>
        <div className='flex flex-col w-full h-full'>
          <div className='h-full w-full p-8 flex flex-row'>
            <Image alt='' src={img} width={100} height={200} className='h-32' />
            <div className='ml-8 p-4'>
              <div className='font-bold mb-3'> {list.name}</div>
              <div className='flex flex-col text-gray-400 text-sm'>
                <div>分类： {list.label}</div>
                <div>作者： {list.author}</div>
                <div>简介： {list.introduction}</div>
              </div>
              <Button
                onClick={() => {
                  frontDownload();
                }}
              >
                下载
              </Button>
            </div>
          </div>
          <div className='w-full h-full flex flex-row'>
            <div className='w-1/2 flex flex-col'>
              {list.section.slice(0, 10).map(item => (
                <li key={item.id} className={lineStyle + ' flex flex-row mb-2'}>
                  <div className={'mr-3 text-green-500 relative' + bulletStyle}>
                    <div className='text-sm absolute z-10'>{item.id}</div>
                  </div>
                  <div className='ml-4'>{item.content}</div>
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
