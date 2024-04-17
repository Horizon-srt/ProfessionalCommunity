import React from 'react';

export const AnounceItem = () => {
  return (
    <div className='w-full flex relative mb-8'>
      <div className='absolute bg-green-500 w-full h-[0.1rem] mt-14'></div>
      <div className='mr-4 flex w-16 flex-col ml-3'>
        <div className='bg-green-500 h-6 text-white text-center'>16</div>
        <div className='bg-green-200 h-5 text-xs text-center text-gray-400'>
          2024-Apr
        </div>
      </div>
      <div className='mt-3 dark:text-white'>
        Regarding the water outage in Building 2 on April 16th
      </div>
    </div>
  );
};
