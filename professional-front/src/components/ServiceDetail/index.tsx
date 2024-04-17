/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Spin } from 'antd';
import Link from 'next/link';
import style from '@/components/ServiceDetail/styles/style.module.css';
import useFetch from '@/services/use-fetch';

interface ServiceDetailProps {
  slug: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ slug }) => {
  // const { data, isLoading, error } = useFetch({
  //   url: `/services/${slug}`,
  //   method: 'GET',
  //   params: {}
  // });

  const data = {
    sid: '1',
    name: 'Sports items',
    // Mock cover
    cover:
      'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    available: '6:00 - 22:00',
    detail: 'qwertyuiopasdfghjklzxcvbnm',
    type: 'FIXED',
    location: 'Teaching Building 4',
    map: '/mock_map.jpg',
    video: ''
  };

  return (
    <div className={style.backgroundCard}>
      <div className={style.titleStyle}>Location in the community</div>
      <div className={style.imagePosition}>
        <Image
          src={data.map}
          alt='Service map'
          width={'100%'}
          height={'100%'}
        />
      </div>
      <div className={style.contentArea}>
        <div className={style.leftArea}>
          <div className={style.titleArea}>
            <div style={{ fontWeight: 'bold', paddingRight: '1.5rem' }}>
              {data.name}
            </div>
            <div
              style={{ color: '#9E9D9D' }}
            >{`(Open Time: ${data.available})`}</div>
          </div>
          <div
            style={{ paddingTop: '1rem' }}
          >{`Location: ${data.location}`}</div>
          <div style={{ paddingTop: '1rem' }}>{data.detail}</div>
        </div>
        <div className={style.rightArea}>
          <Image src={data.cover} alt='' width={'16rem'} height={'9rem'} />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
