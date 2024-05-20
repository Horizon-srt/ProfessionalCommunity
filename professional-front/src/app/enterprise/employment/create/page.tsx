'use client';
import Card from '@/components/Card';
import { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormProps,
  Input,
  TimePicker,
  message
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Create = () => {
  type FieldType = {
    title?: string;
    content?: string;
    time?: string;
  };

  const defaultParams = {
    url: '/hires/create',
    method: 'POST' as ProvideMethod,
    params: null
  };
  const {
    data: hireData,
    error,
    trigger: createHire
  } = useFetchMutation(defaultParams);

  useEffect(() => {
    if (error) {
      message.error(error.toString());
    }
    if (hireData) {
      message.success('Create Successful');
      router.push('/enterprise/employment/');
    }
  }, [hireData, error]);
  const onFinish: FormProps<FieldType>['onFinish'] = values => {
    console.log(values?.time);
    const startObj = values?.time?.[0];
    const endObj = values?.time?.[1];
    const newParams = {
      title: values.title,
      content: values.content,
      start_time: `${startObj?.$y || 0}/${(startObj?.$M || 2) + 1}/${startObj?.$D || 2 - 1}`,
      end_time: `${endObj?.$y || 0}/${(endObj?.$M || 2) + 1}/${endObj?.$D || 2 - 1}`
    };
    createHire({ ...defaultParams, ...{ params: newParams } });
  };

  const router = useRouter();
  return (
    <div className='flex flex-col justify-between h-full p-4 overflow-auto'>
      <Card
        title={
          <div className='relative flex flex-row justify-between'>
            <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
            <div className='text-lg'>Add New Recruitment</div>
          </div>
        }
      >
        <div className='w-full h-full'>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete='off'
            className='h-full w-2/3 flex flex-col justify-between'
          >
            <div>
              <Form.Item
                label='Recruitment Title'
                name='title'
                rules={[{ required: true, message: 'Please input title!' }]}
              >
                <Input placeholder='Title' />
              </Form.Item>

              <Form.Item
                label='Reruitment Time'
                name='time'
                rules={[
                  {
                    required: true,
                    message: 'Please input recruiment time range!'
                  }
                ]}
              >
                <DatePicker.RangePicker
                  format={'YYYY/MM/DD'}
                  placeholder={['Start', 'End']}
                />
              </Form.Item>
              <Form.Item
                name='content'
                label='Details'
                rules={[
                  {
                    required: true,
                    message: 'Please input recruiment detail!'
                  }
                ]}
              >
                <TextArea style={{ height: '100px' }} />
              </Form.Item>
            </div>
            <div className='w-[50%] ml-[20%] flex flex-row justify-between'>
              <Button
                onClick={() => {
                  router.push('/enterprise/employment/');
                }}
              >
                Cancel
              </Button>
              <Form.Item wrapperCol={{ offset: 8, span: 32 }}>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{ background: 'green' }}
                >
                  Release
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Create;
