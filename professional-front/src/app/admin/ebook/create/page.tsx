/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
'use client';
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  SelectProps,
  Upload,
  message
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles/style.module.css';
import { ProvideMethod } from '@/types/data-types';
import { useFetchMutation } from '@/services/use-fetch';
import { FileType, getAntdFormErrorMessage, getBase64 } from '@/utils/utils';

const Create: React.FC = () => {
  const { TextArea } = Input;
  const router = useRouter();
  const [form] = Form.useForm();

  const defaultCreateParams = {
    url: '/education/ebook',
    method: 'POST' as ProvideMethod,
    params: null
  };

  const beforeUploadCover = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }
    getBase64(file as FileType, url => {
      form.setFieldValue('cover', url);
      setImageUrl(url);
    });
    return false;
  };

  const beforeUploadEpub = (file: FileType) => {
    console.log(file);
    const isEpub = file.type === 'application/epub+zip';
    if (!isEpub) {
      message.error('You can only upload EPUB file!');
      return false;
    }
    const isSmallerThan1m = file.size / 1024 / 1024 < 1;
    if (!isSmallerThan1m) {
      message.error('EPUB file must smaller than 1M');
      return false;
    }
    getBase64(file as FileType, url => {
      form.setFieldValue('content', url);
    });
    return false;
  };

  const {
    data: createReturnData,
    error: createReturnError,
    trigger: createService
  } = useFetchMutation(defaultCreateParams);

  useEffect(() => {
    if (createReturnError) {
      message.error(createReturnError);
    }
  }, [createReturnError]);

  useEffect(() => {
    if (createReturnData) {
      message.success('Ebook added successfully!');
      router.push('/admin/ebook');
    }
  }, [createReturnData]);
  const options: SelectProps['options'] = [
    {
      label: 'Science',
      value: 'science'
    },
    {
      label: 'Literature',
      value: 'literature'
    },
    {
      label: 'Math',
      value: 'math'
    }
  ];

  const { Dragger } = Upload;

  const onCreateFinish = async () => {
    createService({
      ...defaultCreateParams,
      ...{ params: form.getFieldsValue() }
    });
  };
  const onFinishFailed = async (e: any) => {
    message.error(getAntdFormErrorMessage(e));
  };

  const [imageUrl, setImageUrl] = useState<string>();

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
        onClick={onCreateFinish}
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
        Back
      </Button>
    );
  };

  return (
    <div className='px-32 h-full'>
      <Card className={styles.main} style={{ overflow: 'auto' }}>
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
            form={form}
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
                placeholder='Please input Detail, like 1.first chapter 2.second chapter'
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
                beforeUpload={beforeUploadCover}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
                ) : (
                  <button
                    style={{ border: 0, background: 'none' }}
                    type='button'
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              label={'Content(.epub)'}
              // valuePropName='fileList'
              name={'content'}
              getValueFromEvent={normFile}
            >
              <Dragger
                name='file'
                multiple={false}
                style={{ width: '50%' }}
                beforeUpload={beforeUploadEpub}
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
