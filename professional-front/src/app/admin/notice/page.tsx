'use client';
import { AnounceItem } from '@/components/AnounceItem/AnounceItem';
import Card from '@/components/Card';
import React from 'react';

const Tourist: React.FC = () => {
  return (
    // <main>
    <div className='p-4 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
              <div>News Anouncement</div>
            </div>
            {/* <div className='text-green-500 text-sm mt-1'>
              <span className='text-green-500 mr-2 underline'>All News</span>
              {'>'}
            </div> */}
          </div>
          <div className='w-full h-full flex flex-col p-8'>
            <AnounceItem />
            <AnounceItem />
            <AnounceItem />
            <AnounceItem />
            <AnounceItem />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tourist;
