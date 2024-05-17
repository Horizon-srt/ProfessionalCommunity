'use client';
import React, { useEffect, useState } from 'react';
import Card from '../Card';
import { usePagination } from '@/hooks/usePagination';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
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
import { RecruitItem } from '../RecruitmentItem';
import { UserItem } from './UserItem';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { md5 } from 'js-md5';

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

  const { data } = useFetch({
    url: '/users/diff_type',
    method: 'GET' as ProvideMethod,
    params: {
      type: isEnte ? 'ENTERPRISE' : 'ADMIN',
      pageNum,
      offset
    }
  });

  // const mockDatas = [
  //   {
  //     uid: '1111',
  //     name: '2222',
  //     avator: '1121'
  //   }
  // ];

  const defaultRegParams = {
    url: '/register/' + isEnte ? 'enterprise' : 'admin',
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
    }
  }, [registerData, error]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const newParams = {
      ...form.getFieldsValue(),
      ...{ avator: imageUrl },
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

  const handleChange: UploadProps['onChange'] = info => {
    getBase64(info.file.originFileObj, url => {
      setLoading(false);
      setImageUrl(url);
    });
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className='p-3 w-full h-full'>
      <Modal
        title='Add User'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        // forceRender
        okText={'Add'}
        cancelText={'Cancel'}
      >
        <span className='mr-6'>Enterprise/Admin:</span>
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
        >
          <div className='mt-3'>
            <Form.Item label='Name' name='name'>
              <Input placeholder='Title' />
            </Form.Item>
            <Form.Item label='Password' name='password'>
              <Input placeholder='Password' />
            </Form.Item>
            <Form.Item label='Email' name='email'>
              <Input placeholder='Email' />
            </Form.Item>
            <Form.Item label='Phone' name='phone'>
              <Input placeholder='Phone' />
            </Form.Item>
            <Upload
              name='avatar'
              listType='picture-circle'
              className='avatar-uploader'
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
            {isEnte ? (
              <>
                <Form.Item label='CompanyName' name='ename'>
                  <Input placeholder='Ename' />
                </Form.Item>
                <Form.Item label='Description' name='description'>
                  <TextArea />
                </Form.Item>
                <Form.Item label='Cover' name='cover'>
                  <Input placeholder='Cover' />
                </Form.Item>
              </>
            ) : null}
          </div>
        </Form>
      </Modal>
      <Card
        title={
          <div className='relative flex flex-row justify-between'>
            <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
            <div className='text-md'>User Management</div>
            <div>
              <span className='mr-2 text-sm'>Enterprise/Admin:</span>
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
              <UserItem uInfo={data} key={data.uid} />
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
