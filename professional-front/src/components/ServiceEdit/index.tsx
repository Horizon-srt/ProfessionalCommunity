/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Radio,
  Row,
  Spin,
  Upload,
  message,
  Card
} from 'antd';
import Link from 'next/link';
import style from '@/components/ServiceEdit/styles/style.module.css';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
// import Card from '@/components/Card';
import { PlusOutlined } from '@ant-design/icons';
import { ProvideMethod } from '@/types/data-types';
import { useRouter } from 'next/navigation';
import { FileType, getAntdFormErrorMessage, getBase64 } from '@/utils/utils';

interface ServiceEditProps {
  title: string;
  sid: string;
}

const ServiceEdit: React.FC<ServiceEditProps> = ({ title, sid }) => {
  const [form] = Form.useForm();

  const router = useRouter();

  const defaultCreateParams = {
    url: '/services',
    method: 'POST' as ProvideMethod,
    params: null
  };

  const defaultChangeParams = {
    url: '/services/' + sid,
    method: 'PATCH' as ProvideMethod,
    params: null
  };

  const defaultDeleteParams = {
    url: '/services/' + sid,
    method: 'DELETE' as ProvideMethod,
    params: null
  };

  const {
    data: createReturnData,
    error: createReturnError,
    trigger: createService
  } = useFetchMutation(defaultCreateParams);

  const {
    data: changeReturnData,
    error: changeReturnError,
    trigger: changeService
  } = useFetchMutation(defaultChangeParams);

  const {
    data: deleteReturnData,
    error: deleteReturnError,
    trigger: deleteService
  } = useFetchMutation(defaultDeleteParams);

  const beforeUploadImg = (file: any, formFieldKey: string) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }
    getBase64(file as FileType, url => {
      form.setFieldValue(formFieldKey, url);
    });
    return false;
  };

  const beforeUploadVideo = (file: any) => {
    const isMp4 = file.type === 'video/mp4';

    if (!isMp4) {
      message.error('You can only upload MP4 file!');
      return false;
    }

    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      message.error('Video must smaller than 50MB!');
      return false;
    }

    getBase64(file as FileType, url => {
      form.setFieldValue('video', url);
    });
    return false;
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e[0];
    }
    return e?.fileList[0];
  };

  const onCreateFinish = async (values: any) => {
    const finalValue = {
      ...values,
      cover: form.getFieldValue('cover'),
      map: form.getFieldValue('map'),
      video: form.getFieldValue('video')
    };

    if (sid !== '-1') {
      changeService({ ...defaultChangeParams, params: finalValue });
    } else {
      createService({ ...defaultCreateParams, params: finalValue });
    }

    router.back();
  };

  const onFinishFailed = async (e: any) => {
    message.error(getAntdFormErrorMessage(e));
  };

  const CreateForm: React.FC = () => {
    const [serviceType, setServiceType] = useState('FIXED');

    return (
      <Form
        onFinish={onCreateFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'
        form={form}
      >
        <Form.Item
          name={'name'}
          label={'Name'}
          rules={[{ required: true, message: 'Please input service name!' }]}
        >
          <Input className={style.inputStyle} placeholder={'Service Name'} />
        </Form.Item>
        <Form.Item
          name={'available'}
          label={'Available Time'}
          rules={[{ required: true, message: 'Please input available time!' }]}
        >
          <Input className={style.inputStyle} placeholder={'Available Time'} />
        </Form.Item>
        <Form.Item
          name={'detail'}
          label={'Detail'}
          rules={[{ required: true, message: 'Please input detail!' }]}
        >
          <Input.TextArea className={style.inputStyle} placeholder={'Detail'} />
        </Form.Item>
        <Form.Item
          label={'Cover'}
          // valuePropName='fileList'
          name={'cover'}
          rules={[{ required: true }]}
          getValueFromEvent={normFile}
        >
          <Upload
            accept='image/png, image/jpeg'
            // action='/upload.do'
            listType='picture-card'
            multiple={false}
            maxCount={1}
            beforeUpload={f => beforeUploadImg(f, 'cover')}
            // onChange={handleCover}
          >
            <button style={{ border: 0, background: 'none' }} type='button'>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item label={'Service Type'} name={'type'} initialValue={'FIXED'}>
          <Radio.Group
            defaultValue={'FIXED'}
            onChange={e => {
              setServiceType(e.target.value);
            }}
          >
            <Radio value={'FIXED'}>Fixed</Radio>
            <Radio value={'ONDOOR'}>Ondoor</Radio>
          </Radio.Group>
        </Form.Item>
        {serviceType === 'FIXED' ? (
          <>
            <Form.Item
              name={'location'}
              label={'Location'}
              rules={[
                { required: true, message: 'Please input service location!' }
              ]}
            >
              <Input
                className={style.inputStyle}
                placeholder={'Service Location'}
              />
            </Form.Item>
            <Form.Item
              label={'Map'}
              // valuePropName='fileList'
              name={'map'}
              rules={[{ required: true }]}
              getValueFromEvent={normFile}
            >
              <Upload
                // action='/upload.do'
                listType='picture-card'
                multiple={false}
                maxCount={1}
                beforeUpload={f => beforeUploadImg(f, 'map')}
                // onChange={handleMap}
              >
                <button style={{ border: 0, background: 'none' }} type='button'>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
            <Form.Item
              label={'Video'}
              // valuePropName='fileList'
              name={'video'}
              rules={[{ required: true }]}
              getValueFromEvent={normFile}
            >
              <Upload
                // action='/upload.do'
                accept='video/mp4'
                listType='picture-card'
                multiple={false}
                maxCount={1}
                beforeUpload={beforeUploadVideo}
                // onChange={handleVideo}
              >
                <button style={{ border: 0, background: 'none' }} type='button'>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              name={'line'}
              label={'Line'}
              rules={[
                { required: true, message: 'Please input service location!' }
              ]}
            >
              <Input
                className={style.inputStyle}
                placeholder={'Service Location'}
              />
            </Form.Item>
          </>
        )}
        <div className={style.buttonArea}>
          <Form.Item>
            <ReturnButton />
          </Form.Item>
          {/* <Form.Item>
            <DeleteButton />
          </Form.Item> */}
          <Form.Item>
            <SubmitButton />
          </Form.Item>
        </div>
      </Form>
    );
  };

  const EditForm: React.FC = () => {
    const { data, error, isLoading } = useFetch({
      url: `/services/${sid}`,
      method: 'GET',
      params: {}
    });

    const [form] = Form.useForm();

    useEffect(() => {
      if (!isLoading) {
        form.setFieldsValue(data);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    return (
      <>
        {isLoading ? (
          <></>
        ) : (
          <Form
            onFinish={onCreateFinish}
            onFinishFailed={onFinishFailed}
            layout='vertical'
            form={form}
          >
            <Form.Item
              name={'name'}
              label={'Name'}
              rules={[
                { required: true, message: 'Please input service name!' }
              ]}
            >
              <Input
                className={style.inputStyle}
                placeholder={'Service Name'}
              />
            </Form.Item>
            <Form.Item
              name={'available'}
              label={'Available Time'}
              rules={[
                { required: true, message: 'Please input available time!' }
              ]}
            >
              <Input
                className={style.inputStyle}
                placeholder={'Available Time'}
              />
            </Form.Item>
            <Form.Item
              name={'detail'}
              label={'Detail'}
              rules={[{ required: true, message: 'Please input detail!' }]}
            >
              <Input.TextArea
                className={style.inputStyle}
                placeholder={'Available Time'}
              />
            </Form.Item>
            {/* <Form.Item
              label={'Cover'}
              // valuePropName='fileList'
              name={'cover'}
              getValueFromEvent={normFile}
            >
              <Upload
                action='/upload.do'
                listType='picture-card'
                multiple={false}
                maxCount={1}
              >
                <button style={{ border: 0, background: 'none' }} type='button'>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item> */}
            <Form.Item label={'Service Type'}>
              <Radio.Group name='type' defaultValue={data.type} disabled>
                <Radio value={'FIXED'}>Fixed</Radio>
                <Radio value={'ONDOOR'}>Ondoor</Radio>
              </Radio.Group>
            </Form.Item>
            {data.type === 'FIXED' ? (
              <>
                <Form.Item
                  name={'location'}
                  label={'Location'}
                  rules={[
                    {
                      required: true,
                      message: 'Please input service location!'
                    }
                  ]}
                >
                  <Input
                    className={style.inputStyle}
                    placeholder={'Service Location'}
                  />
                </Form.Item>
                {/* <Form.Item
                  label={'map'}
                  // valuePropName='fileList'
                  name={'Map'}
                  getValueFromEvent={normFile}
                >
                  <Upload
                    action='/upload.do'
                    listType='picture-card'
                    multiple={false}
                    maxCount={1}
                  >
                    <button
                      style={{ border: 0, background: 'none' }}
                      type='button'
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  label={'video'}
                  // valuePropName='fileList'
                  name={'Video'}
                  getValueFromEvent={normFile}
                >
                  <Upload
                    action='/upload.do'
                    listType='picture-card'
                    multiple={false}
                    maxCount={1}
                  >
                    <button
                      style={{ border: 0, background: 'none' }}
                      type='button'
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                  </Upload>
                </Form.Item> */}
              </>
            ) : (
              <>
                <Form.Item
                  name={'line'}
                  label={'Line'}
                  rules={[
                    {
                      required: true,
                      message: 'Please input service location!'
                    }
                  ]}
                >
                  <Input
                    className={style.inputStyle}
                    placeholder={'Service Line'}
                  />
                </Form.Item>
              </>
            )}
            <div className={style.buttonArea}>
              <Form.Item>
                <ReturnButton />
              </Form.Item>
              <Form.Item>
                <DeleteButton />
              </Form.Item>
              <Form.Item>
                <SubmitButton />
              </Form.Item>
            </div>
          </Form>
        )}
      </>
    );
  };

  const ReturnButton: React.FC = () => {
    return (
      <Button style={{ width: '7.5rem' }} onClick={() => router.back()}>
        Back
      </Button>
    );
  };

  const DeleteButton: React.FC = () => {
    return (
      <Button
        type='primary'
        danger
        onClick={() => {
          deleteService({ ...defaultDeleteParams, params: {} });
          router.push('/admin/service');
        }}
        style={{ width: '7.5rem' }}
      >
        Delete
      </Button>
    );
  };

  const SubmitButton: React.FC = () => {
    return (
      <Button style={{ width: '7.5rem' }} htmlType='submit' type='primary'>
        Submit
      </Button>
    );
  };

  return (
    <Card
      style={{
        padding: '2rem',
        height: '100%',
        width: '60vw',
        overflow: 'auto'
      }}
      title={title}
    >
      {sid === '-1' ? <CreateForm /> : <EditForm />}
    </Card>
  );
};

export default ServiceEdit;
