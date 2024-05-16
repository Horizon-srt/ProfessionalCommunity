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
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles/style.module.css';
import { ProvideMethod } from '@/types/data-types';
import { useFetchMutation } from '@/services/use-fetch';
import { getBase64 } from '@/utils/utils';

const Create: React.FC = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();

  const router = useRouter();
  const defaultCreateParams = {
    url: '/guides',
    method: 'POST' as ProvideMethod,
    params: null
  };

  const { data, isMutating, error, trigger } =
    useFetchMutation(defaultCreateParams);

  const onCreateFinish = async (values: any) => {
    trigger({
      ...defaultCreateParams,
      params: {
        ...values,
        cover: values.cover?.thumbUrl ? values.cover.thumbUrl : ''
      }
    });
  };

  const onFinishFailed = async (e: any) => {
    // console.log(e);
    message.error(e);
  };

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const beforeUploadImg = (file: any, formFieldKey: string) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }

    getBase64(file as FileType, url => {
      form.setFieldValue(formFieldKey, url);
    });
    return true;
  };

  // const handleChange: UploadProps['onChange'] = info => {
  //   if (info.file.status === 'uploading') {
  //     setLoading(true);
  //     // console.log(info.file);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj as FileType, url => {
  //       setLoading(false);
  //       setImageUrl(url);
  //     });
  //   }
  // };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e[0];
    }
    return e?.fileList[0];
  };

  const SubmitButton: React.FC = () => {
    return (
      <Button style={{ width: '7.5rem' }} htmlType='submit' type='primary'>
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

  useEffect(() => {
    if (!isMutating && error) {
      message.error(error);
    } else if (!isMutating && data) {
      message.info('Create Successful!');
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMutating, error, data]);

  return (
    <div className='p-32 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]' />
              <div style={{ fontSize: '2.5rem' }}>Guide Create</div>
            </div>
          </div>
          <Form
            onFinish={onCreateFinish}
            onFinishFailed={onFinishFailed}
            form={form}
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
                name='cover'
                listType='picture-card'
                multiple={false}
                maxCount={1}
                beforeUpload={f => beforeUploadImg(f, 'cover')}
                // onChange={handleChange}
              >
                <button style={{ border: 0, background: 'none' }} type='button'>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
                {/* {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
                ) : (
                  <button
                    style={{ border: 0, background: 'none' }}
                    type='button'
                  >
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                )} */}
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
            <div className={styles.buttonArea}>
              <Form.Item>
                <ReturnButton />
              </Form.Item>
              <Form.Item>
                <SubmitButton />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Create;
