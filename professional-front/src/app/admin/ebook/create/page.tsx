'use client';
import { Button, Card, Form, GetProp, Input, Select, SelectProps, Upload, UploadProps, message } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InboxOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles/style.module.css';
import { ProvideMethod } from '@/types/data-types';
import { useFetchMutation } from '@/services/use-fetch';

const Create: React.FC<{ params: { detail: string } }> = ({ params }) => {
  const { TextArea } = Input;
  const router = useRouter();
  const defaultCreateParams = {
    url: '/education/ebook',
    method: 'POST' as ProvideMethod,
    params: null
  };

  const beforeUploadCover = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
  };

  const beforeUploadEpub = (file: FileType) => {
    const isEpub = file.type === '/epub';
    if (!isEpub) {
      message.error('You can only upload EPUB file!');
    }
    return isEpub;
  };

  const {
    data: createReturnData,
    error: createReturnError,
    trigger: createService
  } = useFetchMutation(defaultCreateParams);

  const options: SelectProps['options'] = [
    {
      label: 'science',
      value: 'science'
    },
    {
      label: 'computer',
      value: 'computer'
    }
  ];
  for (let i = 10; i < 16; i++) {
    options.push({
      label: i.toString(16) + i,
      value: i.toString(16) + i
    });
  }
  const { Dragger } = Upload;
  const handleFileChange: UploadProps['onChange'] = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleSelect = (value: string[]) => {
    console.log(`selected ${value}`);
  };

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
        onClick={() => router.push('/admin/ebook')}
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
        onClick={() => router.push('/admin/ebook')}
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
              <div style={{ fontSize: '2.5rem' }}>Add New Book</div>
            </div>
          </div>
          <Form
            onFinish={onCreateFinish}
            onFinishFailed={onFinishFailed}
            layout='vertical'
          >
            <Form.Item
              name={'name'}
              label={'Book name'}
              rules={[{ required: true, message: 'Please input guide name!' }]}
            >
              <Input placeholder='Book name' style={{ width: '50%' }} />
            </Form.Item>
            <Form.Item
              name={'description'}
              label={'Description'}
              rules={[
                { required: true, message: 'Please input guide description!' }
              ]}
            >
              <Input placeholder='Description' style={{ width: '50%' }} />
            </Form.Item>
            <Form.Item
              name={'detail'}
              label={'Detail'}
              rules={[
                { required: true, message: 'Please input guide detail!' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder='Please input Detail'
                style={{ width: '50%' }}
              ></TextArea>
            </Form.Item>
            <Form.Item
              name={'label'}
              label={'Label'}
              rules={[{ required: true, message: 'Please input guide label!' }]}
            >
              <Select
                mode='multiple'
                allowClear
                style={{ width: '50%' }}
                placeholder='Please select'
                onChange={handleSelect}
                options={options}
              />
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
                beforeUpload={beforeUploadCover}
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
              label={'Cover'}
              // valuePropName='fileList'
              name={'cover'}
              getValueFromEvent={normFile}
            >
              <Dragger
                name='file'
                multiple={true}
                style={{ width: '50%' }}
                action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
                beforeUpload={beforeUploadEpub}
                onChange={handleFileChange}
              >
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>
                  Click or drag file to this area to upload
                </p>
                <p className='ant-upload-hint'>
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger>
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
