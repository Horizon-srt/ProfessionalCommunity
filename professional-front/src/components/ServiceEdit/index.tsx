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
  const [cover, setCover] = useState<string | ArrayBuffer>('');
  const [map, setMap] = useState<string | ArrayBuffer>('');
  const [video, setVideo] = useState<string | ArrayBuffer>('');

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
    method: 'PATCH' as ProvideMethod,
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
    getBase64(file as FileType, url => {
      form.setFieldValue(formFieldKey, url);
    });
    return false;
  };

  const beforeUploadVideo = (file: any) => {
    getBase64(file as FileType, url => {
      form.setFieldValue('video', url);
    });
    return false;
  };

  // const handleCover = async (info: any) => {
  //   if (info.file.status === 'done') {
  //     const reader = new FileReader();
  //     reader.addEventListener('load', () => setCover(reader.result || ''));
  //     reader.readAsDataURL(info.file.originFileObj);
  //   }
  // };

  // const handleMap = async (info: any) => {
  //   if (info.file.status === 'done') {
  //     const reader = new FileReader();
  //     reader.addEventListener('load', () => setMap(reader.result || ''));
  //     reader.readAsDataURL(info.file.originFileObj);
  //   }
  // };

  // const handleVideo = async (info: any) => {
  //   if (info.file.status === 'done') {
  //     const reader = new FileReader();
  //     reader.addEventListener('load', () => setVideo(reader.result || ''));
  //     reader.readAsDataURL(info.file.originFileObj);
  //   }
  // };

  const normFile = (e: any) => {
    // TODO: 视频转换成base64
    if (Array.isArray(e)) {
      return e[0];
    }
    return e?.fileList[0];
  };

  const onCreateFinish = async (values: any) => {
    const finalValue = {
      ...values,
      // TODO: 视频还没转成base64
      // cover: values.cover?.thumbUrl ? values.cover.thumbUrl : '',
      // map: values.map?.thumbUrl ? values.map.thumbUrl : '',
      // video: values.video?.thumbUrl ? values.video.thumbUrl : ''
      cover: form.getFieldValue('cover'),
      map: form.getFieldValue('map'),
      video: form.getFieldValue('video')
    };

    console.log(finalValue);

    if (sid !== '-1') {
      changeService({ ...defaultChangeParams, params: finalValue });
    } else {
      createService({ ...defaultCreateParams, params: finalValue });
    }
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
          <Input.TextArea
            className={style.inputStyle}
            placeholder={'Available Time'}
          />
        </Form.Item>
        <Form.Item
          label={'Cover'}
          // valuePropName='fileList'
          name={'cover'}
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
    // const { data, error, isLoading } = useFetch({
    //   url: `/services/${sid}`,
    //   method: 'GET',
    //   params: {}
    // });

    const data = {
      sid: 'aa',
      name: 'string',
      available: 'string',
      detail: 'string',
      type: 'ONDOOR',
      // 针对不同服务类型
      location: 'string',
      map: 'string',
      video: 'dada',
      line: 'dadadad'
    };

    const [isLoading, setIsLoading] = useState(true);

    const [form] = Form.useForm();

    useEffect(() => {
      if (!isLoading) {
        form.setFieldsValue(data);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    useEffect(() => {
      setIsLoading(false);
    }, []);

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
      style={{ padding: '2rem', height: '100%', overflow: 'auto' }}
      title={title}
    >
      {sid === '-1' ? <CreateForm /> : <EditForm />}
    </Card>
  );
};

export default ServiceEdit;
