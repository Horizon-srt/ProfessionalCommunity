/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Col, Image, Modal, Row, Spin, Upload, message } from 'antd';
import Card from '@/components/Card';
import Link from 'next/link';
import style from '@/components/NoticeDetail/styles/style.module.css';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
import { UploadOutlined } from '@ant-design/icons';
import { ProvideMethod } from '@/types/data-types';

interface NoticeDetailProps {
  nid: string;
}

const NoticeDetail: React.FC<NoticeDetailProps> = ({ nid }) => {
  // const { data, isLoading, error } = useFetch({
  //   url: `/services/${nid}`,
  //   method: 'GET',
  //   params: {}
  // });

  const data = {
    nid: '2',
    title: 'String',
    time: '2024-1-1',
    content:
      'string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;string;'
  };

  const isLoading = false;
  const error = '';

  return (
    <div className='p-4 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          {isLoading || error ? (
            <Spin />
          ) : (
            <>
              <div className='flex flex-row justify-between'>
                <div className='relative'>
                  <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
                  <div>{data.title}</div>
                </div>
              </div>
              <div
                className='w-full h-full flex flex-col p-8'
                style={{
                  padding: '2rem'
                }}
              >
                <div className={style.messageBox}>{data.content}</div>
                <div
                  style={{
                    color: '#686868',
                    marginTop: '1rem',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    alignContent: 'end'
                  }}
                >
                  <div>Green Life Commuty</div>
                  <div>{data.time}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NoticeDetail;
