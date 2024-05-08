'use client';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  Spin,
  Upload,
  message
} from 'antd';
import style from '@/components/UserInfoCard/styles/style.module.css';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { useStore } from '@/hooks/useStore';
import Card from '../Card';
// import Card from '@/components/Card';

interface UserInfoCardProps {
  // width: string;
  // height: string;
}

const UserInfoCard: React.FC<UserInfoCardProps> = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [uid, setUid] = useState('');
  const [form] = Form.useForm();

  const isExpand = useStore(state => state.userInfoIsExpand);

  const switchExpand = useStore(state => state.switchExpand);
  const userInfoExpandStlye = `
  ${isExpand ? 'h-[65%]' : 'h-[40%]'}`;

  const defaultChangeParams = {
    url: `/users/${uid}`,
    method: 'PATCH' as ProvideMethod,
    params: {}
  };

  const { error: updateError, trigger: change } =
    useFetchMutation(defaultChangeParams);

  const { data, isLoading, error } = useFetch({
    url: `/users/${uid}`,
    method: 'GET',
    params: {}
  });

  const onFinish = async (values: any) => {
    console.log(values);
    change({
      ...defaultChangeParams,
      params: {
        ...values,
        // TODO: 转换文件到base64并发送
        proof: values.status,
        status: ''
      }
    });
  };

  const onFinishFailed = (e: any) => {
    // console.log('!!!' + e);
    message.error(e);
  };

  const beforeUploadPdf = (file: any) => {
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
      message.error('You can only upload PDF file!');
      return;
    }
    return isPdf;
  };

  useEffect(() => {
    setUid(localStorage.getItem('user-id') || '');
  }, []);

  useEffect(() => {
    if (!isLoading && data) {
      form.setFieldsValue({ ...data });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, error]);

  useEffect(() => {
    message.error('Updata failed');
  }, [updateError]);

  return (
    // <div className='h-40 p-3 h-1/6'>
    //   <Card title='Personal'>
    //     <div className='flex flex-row w-full bg-white dark:bg-black h-8'>
    //       <div className='w-3/12'>
    //         <Avatar />
    //       </div>
    //       <div className='w-9/12 flex flex-col'>
    //         <div className='text-base text-right font-bold'>San Zhang</div>
    //         <div className='text-sm text-right text-gray-400'>
    //           Owner of Room 323, Unit 1, No. 14
    //         </div>
    //         <Divider />
    //       </div>
    //     </div>
    //   </Card>
    // </div>
    <div className={`p-3 transition-all ${userInfoExpandStlye}`}>
      <Card title='Personal' className='h-[80%]'>
        <div className='h-full flex flex-col w-full'>
          <div className='flex flex-row w-full bg-transparent dark:bg-black'>
            <div className='w-3/12'>
              <Avatar />
            </div>
            <div className='w-9/12 flex flex-col'>
              <div className='text-base text-right font-bold'>San Zhang</div>
              <div className='text-sm text-right text-gray-400'>
                Owner of Room 323, Unit 1, No. 14
              </div>
            </div>
          </div>
          <Divider />
          <div className='overflow-scroll h-[60%]'>
            <div className={!isExpand ? 'hidden' : 'bg-transparent'}>
              <div className={style.formStyle}>
                <Spin spinning={isLoading || error}>
                  <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ span: 6 }}
                    labelAlign='left'
                    style={{ width: '100%' }}
                  >
                    <Form.Item
                      name={'name'}
                      label={'Name'}
                      rules={[
                        { required: true, message: 'Please input name!' }
                      ]}
                    >
                      <Input
                        className={style.inputStyle}
                        placeholder={'Name'}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item
                      name={'email'}
                      label={'Email'}
                      rules={[
                        { required: true, message: 'Please input email!' }
                      ]}
                    >
                      <Input
                        className={style.inputStyle}
                        placeholder={'Email'}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item
                      name={'phone'}
                      label={'Phone'}
                      rules={[
                        { required: true, message: 'Please input phone!' }
                      ]}
                    >
                      <Input
                        className={style.inputStyle}
                        placeholder={'Phone'}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Divider />
                    <Form.Item
                      name={'building'}
                      label={'Building'}
                      rules={[
                        { required: true, message: 'Please input Building!' }
                      ]}
                    >
                      <Input
                        className={style.inputStyle}
                        placeholder={'Building'}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item
                      name={'unit'}
                      label={'Unit'}
                      rules={[
                        { required: true, message: 'Please input Unit!' }
                      ]}
                    >
                      <Input
                        className={style.inputStyle}
                        placeholder={'Unit'}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item
                      name={'room'}
                      label={'Room'}
                      rules={[
                        { required: true, message: 'Please input room!' }
                      ]}
                    >
                      <Input
                        className={style.inputStyle}
                        placeholder={'Room'}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Divider />
                    <Form.Item
                      name={'status'}
                      label={'Status'}
                      rules={[
                        { required: true, message: 'Please upload proof!' }
                      ]}
                    >
                      {isEditing ? (
                        <>
                          <Upload
                            multiple={false}
                            maxCount={1}
                            beforeUpload={beforeUploadPdf}
                          >
                            <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button>
                          </Upload>
                        </>
                      ) : (
                        <span className='ant-form-text'>
                          {data?.proof ? data?.proof : ''}
                        </span>
                      )}
                    </Form.Item>
                    <div
                      className={isEditing ? style.buttonArea : ''}
                      hidden={!isEditing}
                    >
                      <Form.Item style={{ marginBottom: '0px' }}>
                        <Button
                          style={{
                            color: '#6DC570',
                            width: '7.5rem'
                          }}
                          onClick={() => setIsEditing(false)}
                        >
                          Cancle
                        </Button>
                      </Form.Item>
                      <Form.Item style={{ marginBottom: '0px' }}>
                        <Button
                          style={{
                            backgroundColor: '#6DC570',
                            color: '#16A609',
                            width: '7.5rem'
                          }}
                          htmlType='submit'
                        >
                          OK!
                        </Button>
                      </Form.Item>
                    </div>
                    <div
                      className={!isEditing ? style.editButton : ''}
                      hidden={isEditing}
                    >
                      <EditOutlined
                        onClick={() => setIsEditing(true)}
                        style={{ color: '#16A609' }}
                      />
                    </div>
                  </Form>
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserInfoCard;
