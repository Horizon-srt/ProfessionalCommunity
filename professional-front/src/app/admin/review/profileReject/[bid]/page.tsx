'use client';
import { Button, Card, Form, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles/style.module.css';
import { ProvideMethod } from '@/types/data-types';
import { useFetchMutation } from '@/services/use-fetch';

const Reject: React.FC<{ params: { bid: string } }> = ({ params }) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();

  const router = useRouter();
  const defaultRejectParams = {
    url: `/hires/${params.bid}`,
    method: 'PATCH' as ProvideMethod,
    params: null
  };

  const { data, isMutating, error, trigger } =
    useFetchMutation(defaultRejectParams);

  const onRejectFinish = async (values: any) => {
    trigger({
      ...defaultRejectParams,
      params: {
        ...values,
        status: values.reason
      }
    });
  };

  const onFinishFailed = async (e: any) => {
    // console.log(e);
    message.error(e);
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
        onClick={() => router.push('/admin/review')}
      >
        Cancel
      </Button>
    );
  };

  useEffect(() => {
    if (!isMutating && error) {
      message.error(error);
    } else if (!isMutating && data) {
      message.info('Reject Successful!');
      router.push('/admin/review');
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
              <div style={{ fontSize: '2.5rem' }}>Profile Reject Reasons</div>
            </div>
          </div>
          <Form
            onFinish={onRejectFinish}
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
              name={'reason'}
              label={'Reason'}
              rules={[{ required: true, message: 'Please input reasons!' }]}
            >
              <TextArea
                rows={4}
                placeholder='Please input reason'
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

export default Reject;
