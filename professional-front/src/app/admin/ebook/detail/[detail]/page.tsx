import Card from '@/components/Card';
import React from 'react';
import Image from 'next/image';
import img from '@/../public/next.svg';

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
  return (
    <div className='w-full h-full'>
      <Card>
        <div className='flex flex-col w-full h-full'>
          <div className='h-full w-full p-8 flex flex-row'>
            <Image alt='' src={img} width={100} height={200} className='h-32' />
            <div className='ml-8 p-4'>
              <div className='font-bold mb-3'>《人间失格》</div>
              <div className='flex flex-col text-gray-400 text-sm'>
                <div>分类： 外国文学</div>
                <div>作者： 太宰治</div>
                <div>简介： bla bla bla</div>
              </div>
            </div>
          </div>
          <div className='w-full h-full flex flex-row'>
            <div className='w-1/2 flex flex-col'>
              <li className={lineStyle + 'flex flex-row mb-2'}>
                <div className={'mr-3 text-green-500 relative' + bulletStyle}>
                  <div className='text-sm absolute z-10'>1</div>
                </div>
                <div className='ml-4'>天才的诞生</div>
              </li>
              <li className={lineStyle + 'flex flex-row'}>
                <div className={'mr-3 text-green-500 relative' + bulletStyle}>
                  <div className='text-sm absolute z-10'>2</div>
                </div>
                <div className='ml-4'>天才的诞生</div>
              </li>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Detail;
