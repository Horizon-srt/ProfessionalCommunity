/* eslint-disable max-len */
import React, { useEffect } from 'react';
// import useFetch from '@/services/use-fetch';
import Card from '@/components/Card';
import { Image, Spin, message } from 'antd';
import Link from 'next/link';
import useFetch from '@/services/use-fetch';

interface SubscribeDetailProps {
  srid: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SubscribeDetail: React.FC<SubscribeDetailProps> = ({ srid }) => {
  const { data, isLoading, error } = useFetch({
    url: `/services/subscribe/rec/${srid}`,
    method: 'GET',
    params: {}
  });

  // const data = {
  //   srid: '1',
  //   avator: '/default_image1.jpg',
  //   cover: '/default_image2.jpg',
  //   building: 'string',
  //   unit: 'string',
  //   room: 'string',
  //   name: 'Zhang San',
  //   service_name: 'Fix air conditioner',
  //   phone: '13832581023',
  //   line: '13832581023',
  //   detail:
  //     'string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;',
  //   time: 'today'
  // };

  // const isLoading = false;
  // const error = '';

  useEffect(() => {
    if (!isLoading && error) {
      message.error(error);
    }
  }, [isLoading, error]);

  return (
    <div className='p-4 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
              <div>Booking Detail</div>
            </div>
            <Link
              href={'/admin/service'}
              style={{ color: '#16A609', marginRight: '3rem' }}
            >
              {'Back  >'}
            </Link>
          </div>
          {isLoading || error ? (
            <Spin spinning={true} />
          ) : (
            <div
              className='w-full h-full flex flex-col p-8'
              style={{ padding: '3rem', display: 'flex', flexDirection: 'row' }}
            >
              <div
                style={{
                  width: '32%',
                  height: '100%',
                  padding: '3rem',
                  marginRight: '1.5%',
                  borderRadius: '20px',
                  backgroundColor: '#E7FFE8'
                }}
              >
                <div>
                  <Image
                    src={data?.avator || ''}
                    alt=''
                    width={'6rem'}
                    height={'6rem'}
                    style={{ borderRadius: '32px' }}
                  />
                </div>

                <div style={{ marginTop: '3rem', display: 'flex' }}>
                  <div style={{ width: '5rem' }}>Name: </div>
                  <div>{data?.name || 'loading...'}</div>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex' }}>
                  <div style={{ width: '5rem' }}>Phone: </div>
                  <div>{data?.phone || 'loading...'}</div>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex' }}>
                  <div style={{ width: '5rem' }}>Building: </div>
                  <div>{data?.building || 'loading...'}</div>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex' }}>
                  <div style={{ width: '5rem' }}>Unit: </div>
                  <div>{data?.unit || 'loading...'}</div>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex' }}>
                  <div style={{ width: '5rem' }}>Room: </div>
                  <div>{data?.room || 'loading...'}</div>
                </div>
              </div>
              <div
                style={{
                  width: '65%',
                  height: '100%',
                  marginLeft: '1.5%'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '50%',
                    backgroundColor: '#D9D9D9',
                    padding: '3rem',
                    borderRadius: '20px 20px 0 0',
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                >
                  <div style={{ width: '50%', height: '100%' }}>
                    <Image
                      src={data?.cover || 'loading...'}
                      alt=''
                      width={'100%'}
                      height={'100%'}
                    />
                  </div>
                  <div style={{ margin: '2rem' }}>
                    <div style={{ fontSize: 'larger' }}>
                      {data?.service_name || 'loading...'}
                    </div>
                    <div
                      style={{
                        fontSize: 'small',
                        color: '#9E9D9D',
                        marginTop: '1rem'
                      }}
                    >
                      {data?.line || 'loading...'}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '50%',
                    padding: '3rem',
                    borderRadius: '0 0 20px 20px',
                    borderTop: '0px solid #000000',
                    border: '1px solid #000000'
                  }}
                >
                  <div>{`Booking Time: ${data?.time || 'loading...'}`}</div>
                  <div style={{ marginTop: '1rem', wordWrap: 'break-word' }}>
                    {'Description: ' + data?.detail || 'loading...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SubscribeDetail;
