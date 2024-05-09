import React from 'react';

interface IAnounceItem {
  nid: string;
  title: string;
  time: string;
  // 节选，大概几十字
  content_slice: string;
}
export const AnounceItem = ({ data }: { data: IAnounceItem }) => {
  const [year, month, day] = data.time.split('-');
  return (
    <div className='w-full flex relative mb-8'>
      <div className='absolute bg-green-500 w-full h-[0.1rem] mt-14'></div>
      <div className='mr-4 flex w-16 flex-col ml-3'>
        <div className='bg-green-500 h-6 text-white text-center'>{day}</div>
        <div className='bg-green-200 h-5 text-xs text-center text-gray-400'>
          {`${year}-${month}`}
        </div>
      </div>
      <div className='mt-3 dark:text-white'>{data.content_slice}</div>
    </div>
  );
};
