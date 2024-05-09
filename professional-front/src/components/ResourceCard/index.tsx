import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import Link from 'next/link';
import useFetch from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { usePagination } from '@/hooks/usePagination';
import { PieChart } from '@/app/normal/family/PieChart';

interface ResourceCardProps {
  width: string;
  height: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ width, height }) => {
  const [type, setTypes] = useState('TOURIST');
  useEffect(() => {
    setTypes(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  const { offset, pageNum } = usePagination({
    offset: 20,
    pageNum: 1
  });
  // 先写死，不确定是context传递还是props传递
  const aid = '1234';
  const { data } = useFetch({
    url: '/addresses/resources/' + aid,
    method: 'GET' as ProvideMethod,
    params: {
      pageNum,
      offset
    }
  });

  const isLoading = false;

  return (
    <Card
      title={<div style={{ fontWeight: 'bold' }}>Resource Type Ratio</div>}
      extra={
        <Link
          href={`/${type.toLowerCase()}/family`}
          style={{ color: '#16A609' }}
        >
          {'More >'}
        </Link>
      }
      style={{
        width: width,
        height: height,
        borderRadius: '20px',
        overflow: 'auto'
      }}
      styles={{ body: { paddingTop: '0px' } }}
    >
      <Spin spinning={isLoading} size='large'>
        {isLoading ? (
          <div></div>
        ) : (
          <div className='mt-5'>
            <PieChart data={data} />
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default ResourceCard;
