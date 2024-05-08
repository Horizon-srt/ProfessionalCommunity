'use client';
import {
  Button,
  Card,
  Form,
  GetProp,
  Input,
  Upload,
  UploadProps,
  message
} from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles/style.module.css';
import { ProvideMethod } from '@/types/data-types';
import { useFetchMutation } from '@/services/use-fetch';

const Create: React.FC<{ params: { detail: string } }> = ({ params }) => {
  const { TextArea } = Input;
  const router = useRouter();
  const defaultCreateParams = {
    url: '/services',
    method: 'POST' as ProvideMethod,
    params: null
  };

  const {
    data: createReturnData,
    error: createReturnError,
    trigger: createService
  } = useFetchMutation(defaultCreateParams);

  const onCreateFinish = async (values: any) => {
    const finalValue = {
      ...values,
      // TODO: 视频还没转成base64
      cover: values.cover?.thumbUrl ? values.cover.thumbUrl : '',
      map: values.map?.thumbUrl ? values.map.thumbUrl : '',
      video: values.video?.thumbUrl ? values.video.thumbUrl : ''
    };

    console.log(finalValue);

    // if (sid !== '-1') {
    //   changeService({ ...defaultChangeParams, params: finalValue });
    // } else {
    //   createService({ ...defaultCreateParams, params: finalValue });
    // }
  };
  const onFinishFailed = async (e: any) => {
    message.error(e);
  };
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
  };
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      console.log(info.file);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, url => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e[0];
    }
    return e?.fileList[0];
  };

  const SubmitButton: React.FC = () => {
    return (
      <Button
        style={{ width: '7.5rem' }}
        onClick={() => router.push('/admin/guide')}
        htmlType='submit'
        type='primary'
      >
        Submit
      </Button>
    );
  };

  const ReturnButton: React.FC = () => {
    return (
      <Button
        style={{ width: '7.5rem' }}
        onClick={() => router.push('/admin/guide')}
      >
        Return
      </Button>
    );
  };

  return (
    <div className='p-32 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]'></div>
              <div style={{ fontSize: '2.5rem' }}>Guide Create</div>
            </div>
          </div>
          <Form
            onFinish={onCreateFinish}
            onFinishFailed={onFinishFailed}
            layout='vertical'
          >
            <Form.Item
              name={'title'}
              label={'Title'}
              rules={[{ required: true, message: 'Please input guide name!' }]}
            >
              <Input placeholder='Title' style={{ width: '50%' }} />
            </Form.Item>
            <Form.Item
              label={'Cover'}
              // valuePropName='fileList'
              name={'cover'}
              getValueFromEvent={normFile}
            >
              <Upload
                name='avatar'
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}
                action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
                ) : (
                  <button
                    style={{ border: 0, background: 'none' }}
                    type='button'
                  >
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              name={'content'}
              label={'Content'}
              rules={[{ required: true, message: 'Please input guide name!' }]}
            >
              <TextArea
                rows={4}
                placeholder='Please input content'
                style={{ width: '50%' }}
              ></TextArea>
            </Form.Item>
          </Form>
          <div className={styles.buttonArea}>
            <Form.Item>
              <ReturnButton />
            </Form.Item>
            <Form.Item>
              <SubmitButton />
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Create;
