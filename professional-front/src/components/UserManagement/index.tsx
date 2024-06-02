/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState } from 'react';
import Card from '../Card';
import { usePagination } from '@/hooks/usePagination';
import { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import {
  Button,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Switch,
  Upload,
  UploadProps
} from 'antd';
import { UserItem } from './UserItem';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { md5 } from 'js-md5';
import styles from '@/components/UserManagement/styles/style.module.css';

interface IUser {
  uid: string;
  avator: string;
  name: string;
}
export const UserManagement = () => {
  const { offset, pageNum, setCurrentPage } = usePagination({
    offset: 10,
    pageNum: 1
  });
  const [isEnte, setIsEnte] = useState(false);

  const defaultDiffParams = {
    url: '/users/diff_type',
    method: 'GET' as ProvideMethod,
    params: {
      type: isEnte ? 'ENTERPRISE' : 'ADMIN',
      pageNum,
      offset
    }
  };
  const { data, trigger } = useFetchMutation(defaultDiffParams);

  // const mockDatas = [
  //   {
  //     uid: '1111',
  //     name: '2222',
  //     avator: '1121'
  //   }
  // ];

  useEffect(() => {
    trigger(defaultDiffParams);
  }, [isEnte]);

  const defaultRegParams = {
    url: '/register/' + (isEnte ? 'enterprise' : 'admin'),
    method: 'POST' as ProvideMethod,
    params: null
  };

  const {
    data: registerData,
    error,
    trigger: register
  } = useFetchMutation(defaultRegParams);

  useEffect(() => {
    if (error) {
      message.error(error.toString());
    }
    if (registerData) {
      message.success('Register Successful');
      trigger(defaultDiffParams);
    }
  }, [registerData, error]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const newParams = {
      ...form.getFieldsValue(),
      ...{ avator: imageUrl },
      cover: coverImageUrl,
      password: md5(form.getFieldValue('password'))
    };
    register({ ...defaultRegParams, ...{ params: newParams } });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();

  const getBase64 = (img: any, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [coverImageUrl, setCoverImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = info => {
    getBase64(info.file.originFileObj, url => {
      setLoading(false);
      setImageUrl(url);
      // console.log(url);
    });
  };

  const handleCoverChange: UploadProps['onChange'] = info => {
    getBase64(info.file.originFileObj, url => {
      setLoading(false);
      setCoverImageUrl(url);
      // console.log(url);
    });
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className={styles.main}>
      <Modal
        title='Add User'
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <span className='mr-6'>Admin/Enterprise:</span>
        <Switch
          className='ml-6'
          value={isEnte}
          onChange={value => setIsEnte(value)}
        />
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          // onFinishFailed={onFinishFailed}
          autoComplete='off'
          className='h-full w-2/3 flex flex-col justify-between'
          onFinish={handleOk}
        >
          <div className='mt-3'>
            <Form.Item label='Name' name='name' required>
              <Input placeholder='Name' />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[{ min: 6 }, { required: true }]}
              required
            >
              <Input.Password placeholder='Password' />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              required
              rules={[{ required: true, type: 'email' }]}
            >
              <Input placeholder='Email' />
            </Form.Item>
            <Form.Item
              label='Phone'
              name='phone'
              required
              rules={[{ required: true }]}
            >
              <Input placeholder='Phone' />
            </Form.Item>
            <Form.Item
              label='Avatar'
              name='avatar'
              required
              rules={[{ required: true }]}
            >
              <Upload
                name='avatar'
                maxCount={1}
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            {isEnte ? (
              <>
                <Form.Item
                  label='CompanyName'
                  name='ename'
                  rules={[{ required: true }]}
                >
                  <Input placeholder='Ename' />
                </Form.Item>
                <Form.Item
                  label='Description'
                  name='description'
                  rules={[{ required: true }]}
                >
                  <TextArea />
                </Form.Item>
                {/* <Form.Item label='Cover' name='cover'>
                  <Input placeholder='Cover' />
                </Form.Item> */}
                <Form.Item
                  label='Cover'
                  name='cover'
                  rules={[{ required: true }]}
                >
                  <Upload
                    name='cover'
                    maxCount={1}
                    listType='picture-card'
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleCoverChange}
                  >
                    {coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverImageUrl}
                        alt='cover'
                        style={{ width: '100%' }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </>
            ) : null}
            <Form.Item className='w-full'>
              <div className='w-full flex flew-row align-end ml-[60%]'>
                <Button
                  type='primary'
                  htmlType='submit'
                  size='large'
                  style={{ width: '150px' }}
                >
                  Add
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Card
        title={
          <div className='relative flex flex-row justify-between'>
            <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
            <div className='text-md'>User Management</div>
            <div>
              <span className='mr-2 text-sm'>Admin/Enterprise:</span>
              <Switch
                className='ml-6'
                value={isEnte}
                onChange={value => setIsEnte(value)}
              />
            </div>

            <div
              className='text-green-500 text-lg cursor-pointer'
              onClick={showModal}
            >
              +
            </div>
          </div>
        }
      >
        <div className='w-full h-full'>
          <div
            className={`h-[80%] w-full flex flex-col justify-start 
             align-center`}
          >
            {(!data?.users || data?.users?.length === 0) && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {data?.users?.map((data: IUser) => (
              <UserItem
                uInfo={data}
                key={data.uid}
                deleteCallback={() => trigger(defaultDiffParams)}
              />
            ))}
          </div>
          <div className='w-full flex justify-end'>
            <Pagination
              defaultCurrent={1}
              total={(data?.total_pages || 1) * 10}
              pageSize={10}
              current={pageNum}
              onChange={page => {
                setCurrentPage(page);
              }}
              showSizeChanger={false}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
