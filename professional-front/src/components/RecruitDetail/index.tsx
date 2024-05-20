/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Spin,
  Upload,
  message
} from 'antd';
import Card from '@/components/Card';
import Link from 'next/link';
import style from '@/components/RecruitDetail/styles/style.module.css';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
import { UploadOutlined } from '@ant-design/icons';
import { ProvideMethod } from '@/types/data-types';
import { getBase64 } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { useForm } from 'antd/es/form/Form';

interface RecruiteDetailProps {
  hid: string;
}

const RecruiteDetail: React.FC<RecruiteDetailProps> = ({ hid }) => {
  const router = useRouter();
  const [form] = useForm();
  const [type, setType] = useState('TOURIST');
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState('');
  const { data, isLoading, error } = useFetch({
    url: `/hires/${hid}`,
    method: 'GET',
    params: {}
  });

  const defaultUploadParams = {
    url: '/resume',
    method: 'POST' as ProvideMethod,
    params: null
  };

  const {
    data: upData,
    error: upError,
    trigger: upload
  } = useFetchMutation(defaultUploadParams);

  useEffect(() => {
    if (upError) {
      message.error(error);
    } else if (data?.message) {
      message.success(data?.message);
    }
  }, [upError, upData]);
  // const data = {
  //   hid: '1',
  //   title: '招聘廉价劳动力',
  //   ename: '北京工业大学',
  //   start_time: '2024-1-1',
  //   end_time: '2024-12-31',
  //   content:
  //     // eslint-disable-next-line max-len
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.;',
  //   status: 'string;'
  // };

  const beforeUploadPdf = (file: any) => {
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
      message.error('You can only upload PDF file!');
      return false;
    }
    getBase64(file, url => {
      form.setFieldValue('content', url);
    });
    return false;
  };

  const handleUpload = () => {
    upload({
      ...defaultUploadParams,
      ...{
        params: {
          hid,
          ...form.getFieldsValue()
        }
      }
    });
    setShowUpload(false);
  };

  useEffect(() => {
    setType(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  return (
    <div className='p-4 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
              <div>Recruit Detail</div>
            </div>
          </div>
          <div
            className='w-full h-full flex flex-col p-8'
            style={{ padding: '3rem' }}
          >
            <div className={style.basicInfo}>
              <div style={{ fontSize: '22px' }}>Basic Information</div>
              <div className={style.basicInfoArea}>
                <div style={{ width: '33%' }}>
                  <div style={{ fontSize: '0.8rem', color: '#9E9D9D' }}>
                    Company Name:
                  </div>
                  <div>{data?.ename || 'loading...'}</div>
                </div>
                <div style={{ width: '34%' }}>
                  <div style={{ fontSize: '0.8rem', color: '#9E9D9D' }}>
                    Title:
                  </div>
                  <div>{data?.title || 'loading...'}</div>
                </div>
                <div style={{ width: '33%' }}>
                  <div style={{ fontSize: '0.8rem', color: '#9E9D9D' }}>
                    Time:
                  </div>
                  <div>
                    {data?.start_time && data?.end_time
                      ? data.start_time + ' ~ ' + data.end_time
                      : 'loading...'}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '22px' }}>Details</div>
              <div style={{ margin: '1rem 0' }}>
                {data?.content || 'loading...'}
              </div>
            </div>
            <div className={style.buttonArea} hidden={type === 'ENTERPRISE'}>
              <Button
                style={{ width: '7.5rem', color: '#6DC570' }}
                onClick={() => {
                  router.back();
                }}
              >
                Back
              </Button>
              <Button
                style={{ width: '7.5rem' }}
                id={style.applyButton}
                type='primary'
                onClick={() => setShowUpload(true)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <Modal
        title={<div style={{ color: '#6DC570' }}>Upload Your CV </div>}
        open={showUpload}
        maskClosable={true}
        onCancel={() => setShowUpload(false)}
        footer={
          <Button
            id={style.applyButton}
            type='primary'
            onClick={() => {
              handleUpload();
            }}
          >
            Ok
          </Button>
        }
      >
        <Form form={form}>
          <Form.Item name={'content'} label='Content'>
            <div>Please click to upload your CV here:</div>
            <Upload
              multiple={false}
              maxCount={1}
              beforeUpload={beforeUploadPdf}
            >
              <Button style={{ color: '#6DC570' }} icon={<UploadOutlined />}>
                Click to upload
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name={'position'} label={'Position'}>
            <Input placeholder='Please input your position'></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RecruiteDetail;
