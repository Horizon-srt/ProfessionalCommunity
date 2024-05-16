/* eslint-disable max-len */
import React, { useEffect } from 'react';
import style from './styles/style.module.css';
import { Button, Card, Form, Input, message } from 'antd';
import { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const NoticeCreate: React.FC = () => {
  const router = useRouter();

  const defaultNoticeParams = {
    url: '/notifies',
    method: 'POST' as ProvideMethod,
    params: {}
  };

  const { data, trigger, isMutating, error } =
    useFetchMutation(defaultNoticeParams);

  const onFinish = async (value: any) => {
    trigger({
      ...defaultNoticeParams,
      params: {
        ...value,
        time: dayjs().format('YYYY-MM-DD')
      }
    });
  };

  const onFinishFailed = (error: any) => {
    message.error(error);
  };

  useEffect(() => {
    if (!isMutating && error) {
      message.error(error);
    }
  }, [isMutating, error]);

  useEffect(() => {
    if (data && data.nid) {
      message.info('Create successful!');
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className='p-32 h-full'>
      <Card>
        <div className='w-full h-full flex flex-col'>
          <div className='flex flex-row justify-between'>
            <div className='relative'>
              <div className='bg-green-500 w-1 h-16 absolute left-[-1rem]'></div>
              <div style={{ fontSize: '2.5rem' }}>Add New Announcement</div>
            </div>
          </div>
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout='vertical'
          >
            <Form.Item
              name={'title'}
              label={'Title'}
              rules={[
                { required: true, message: 'Please input notice title!' }
              ]}
            >
              <Input placeholder={'Notice Title'} />
            </Form.Item>
            <Form.Item
              name={'content'}
              label={'Content'}
              rules={[
                { required: true, message: 'Please input notice content!' }
              ]}
            >
              <Input.TextArea placeholder={'Notice Content'} />
            </Form.Item>
            <div className={style.buttonArea}>
              <Form.Item>
                <Button id={style.cancelButton} onClick={() => router.back()}>
                  Cancel
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  id={style.submitButton}
                  type='primary'
                  htmlType='submit'
                >
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default NoticeCreate;
