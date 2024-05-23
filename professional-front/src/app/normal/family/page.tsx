'use client';
import Card from '@/components/Card';
import { Button, Radio } from 'antd';
import React, { useState } from 'react';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { Threshold } from './Threshold';
import { usePagination } from '@/hooks/usePagination';
import useFetch from '@/services/use-fetch';
import { ProvideMethod, ResourceType } from '@/types/data-types';
import { useStore } from '@/hooks/useStore';

const Family: React.FC = () => {
  const options = [
    { label: 'Water Consumption', value: ResourceType.WATER },
    { label: 'Eletricity Consumption', value: ResourceType.ELETRIC },
    { label: 'Gas Consumption', value: ResourceType.GAS }
  ];

  const [currentOption, setCurrentOption] = useState(0);
  const { offset, pageNum, nextPage, prevPage } = usePagination({
    offset: 5,
    pageNum: 1
  });

  const uid = useStore(state => state.uid);
  const { data } = useFetch(
    uid
      ? {
          url: '/addresses/resources/' + uid || '0',
          method: 'GET' as ProvideMethod,
          params: {
            pageNum,
            offset
          }
        }
      : null
  );

  return (
    <main className='p-3 h-full'>
      <Card>
        <div className='w-full h-full'>
          <header className='flex justify-between'>
            <span className='font-bold mt-1'>Resource data</span>
            <Button onClick={prevPage} disabled={!!(pageNum === 1)}>
              Last Page
            </Button>
            <Button onClick={nextPage}>Next Page</Button>
            <Radio.Group
              options={options}
              defaultValue={0}
              optionType='button'
              onChange={e => setCurrentOption(e.target.value)}
            />
          </header>
          <main>
            <div>
              <LineChart
                data={data}
                currentOption={currentOption}
                pageNum={pageNum}
              />
            </div>
            <div className='flex flex-row justify-between'>
              <div className='w-[49%]'>
                <Threshold />
              </div>
              <div className='w-[49%]'>
                <Card title='Category proportion'>
                  <PieChart pageNum={pageNum} data={data} />
                </Card>
              </div>
            </div>
          </main>
        </div>
      </Card>
    </main>
  );
};

export default Family;
