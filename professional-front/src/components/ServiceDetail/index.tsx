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
    video: '/default_video.mp4',
    line: '13832581023'
  };

  const Label: React.FC<{ type: string }> = ({ type }) => {
    return (
      <div
        style={{
          borderRadius: '2px',
          backgroundColor: '#16A609',
          fontSize: '0.6rem',
          padding: '2px',
          margin: '2px'
        }}
      >
        {type}
      </div>
    );
  };

  return (
    <div className={style.backgroundCard}>
      <div className={style.titleStyle}>
        Location in the community
        <Label type={data.type} />
      </div>
      <div className={style.imagePosition}>
        {data.type === 'FIXED' ? (
          <Image
            src={data.map}
            alt='Service map'
            width={'100%'}
            height={'100%'}
          />
        ) : (
          <Image
            src={data.cover}
            alt='Service map'
            width={'100%'}
            height={'100%'}
          />
        )}
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
          <div style={{ paddingTop: '1rem' }}>
            {data.type === 'FIXED'
              ? `Location: ${data.location}`
              : `Line: ${data.line}`}
          </div>
          <div style={{ paddingTop: '1rem' }}>{data.detail}</div>
        </div>
        {data.type === 'FIXED' ? (
          <div className={style.rightArea}>
            {/* 放视频 */}
            {/* <Image src={data.cover} alt='' width={'16rem'} height={'9rem'} /> */}
            <video width='320' height='240' controls preload='none'>
              <source src={data.video} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
