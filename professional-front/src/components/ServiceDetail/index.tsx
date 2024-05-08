/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Image,
  Input,
  Modal,
  Row,
  Spin,
  message
} from 'antd';
import Link from 'next/link';
import style from '@/components/ServiceDetail/styles/style.module.css';
// import useFetch from '@/services/use-fetch';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { ProvideMethod } from '@/types/data-types';
import { useFetchMutation } from '@/services/use-fetch';

interface ServiceDetailProps {
  slug: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ slug }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [time, setTime] = useState('');
  const [detail, setDetail] = useState('');
  // const { data, isLoading, error } = useFetch({
  //   url: `/services/${slug}`,
  //   method: 'GET',
  //   params: {}
  // });
  const router = useRouter();

  const dateFormat = 'YYYY-MM-DD';

  const defaultUploadParams = {
    url: '/services/subscribe',
    method: 'POST' as ProvideMethod,
    params: null
  };

  const { trigger, isMutating, error } = useFetchMutation(defaultUploadParams);

  const data = {
    sid: '1',
    name: 'Sports items',
    // Mock cover
    cover:
      'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    available: '6:00 - 22:00',
    detail: 'qwertyuiopasdfghjklzxcvbnm',
    type: 'ONDOOR',
    location: 'Teaching Building 4',
    map: '/mock_map.jpg',
    video: '/default_video.mp4',
    line: '13832581023'
  };

  const handleBook = async () => {
    setShowUpload(false);
    trigger({
      ...defaultUploadParams,
      params: {
        sid: slug,
        time: time,
        detail: detail
      }
    });
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

  useEffect(() => {
    if (!isMutating && error) {
      message.error(error);
    }
  }, [isMutating, error]);

  return (
    <div className={style.backgroundCard}>
      <div className={style.titleStyle}>
        Location in the community
        <Label type={data.type} />
      </div>
      {data.type === 'FIXED' ? (
        <>
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
              <div style={{ paddingTop: '1rem' }}>
                {data.type === 'FIXED'
                  ? `Location: ${data.location}`
                  : `Line: ${data.line}`}
              </div>
              <div style={{ paddingTop: '1rem' }}>{data.detail}</div>
            </div>
            <div className={style.rightArea}>
              {/* 放视频 */}
              {/* <Image src={data.cover} alt='' width={'16rem'} height={'9rem'} /> */}
              <video width='320' height='240' controls preload='none'>
                <source src={data.video} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              width: '100%',
              height: '60%',
              display: 'flex',
              flexDirection: 'row',
              padding: '3rem'
            }}
          >
            <div style={{ width: '65%', height: '100%', marginRight: '1.5%' }}>
              <Image
                src={data.cover}
                width={'100%'}
                height={'100%'}
                alt=''
                style={{ borderRadius: '10px' }}
              />
            </div>
            <div
              style={{
                width: '32%',
                height: '100%',
                marginLeft: '1.5%',
                border: '1 solid #000000',
                padding: '1rem'
              }}
            >
              <div style={{ fontSize: 'large' }}>{data.name}</div>
              <div
                style={{
                  fontSize: 'small',
                  color: '#9E9D9D',
                  marginTop: '0.8rem'
                }}
              >
                {data.line}
              </div>
              <div style={{ marginTop: '1.5rem' }}>{data.available}</div>
              <div style={{ marginTop: '1rem' }}>{data.detail}</div>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <Button
              style={{ width: '7.5rem', color: '#6DC570' }}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button
              style={{ width: '7.5rem' }}
              type='primary'
              id={style.applyButton}
              onClick={() => setShowUpload(true)}
            >
              Book
            </Button>
          </div>
          <Modal
            title={
              <div style={{ color: '#6DC570' }}>
                Enter the booking information
              </div>
            }
            open={showUpload}
            maskClosable={true}
            onCancel={() => setShowUpload(false)}
            footer={
              <Button
                id={style.applyButton}
                type='primary'
                onClick={handleBook}
              >
                Ok
              </Button>
            }
          >
            <div style={{ marginTop: '1rem' }}>Select your booking time</div>
            <DatePicker
              style={{ marginTop: '0.8rem' }}
              defaultValue={dayjs()}
              minDate={dayjs()}
              onChange={value => setTime(value.format(dateFormat))}
            />
            <div style={{ marginTop: '1rem' }}>Enter details</div>
            <Input.TextArea
              style={{ marginTop: '0.8rem' }}
              placeholder='Input whatever your need!'
              onChange={e => {
                const value = e.target.value;
                setDetail(value);
              }}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default ServiceDetail;
