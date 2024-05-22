'use client';
import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Card from '@/components/Card';
import { useStore } from '@/hooks/useStore';
import { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';

interface AssistantCardProps {
  // width: string;
  // height: string;
}

const AssistantCard: React.FC<AssistantCardProps> = () => {
  const isExpand = useStore(state => state.userInfoIsExpand);
  const [msgArr, setMsgArr] = useState<any[]>([]);
  const [content, setContent] = useState<string>('');
  const assistantCardIsExpandStyle = `${isExpand ? 'h-[40%]' : 'h-[80%]'}`;

  const defaultChatParams = {
    url: '/chat',
    method: 'POST' as ProvideMethod,
    params: null
  };
  const { data, trigger } = useFetchMutation(defaultChatParams);
  useEffect(() => {
    if (data?.content) {
      setMsgArr(arr => {
        return [{ isUser: false, content: data?.content }, ...arr];
      });
    }
  }, [data]);
  const handlePressEnter = (event: any) => {
    const message = event.nativeEvent.srcElement.value;
    setContent('');
    trigger({
      ...defaultChatParams,
      ...{
        params: { message }
      }
    });
    setMsgArr(arr => {
      return [{ isUser: true, content: message }, ...arr];
    });
  };

  const userName = useStore(state => state.userName);
  const avator = useStore(state => state.avator);

  return (
    <div
      className={`p-3 justify-end transition-all ${assistantCardIsExpandStyle}`}
    >
      <Card title='AI'>
        <div className='h-50 flex flex-col w-full justify-between'>
          <div
            className={`p-2 overflow-auto ${isExpand ? 'h-[3rem]' : ''} flex flex-col-reverse`}
          >
            {msgArr.map(msg => {
              return (
                <div className='flex flex-col' key={msg?.content?.slice(5)}>
                  <div className='flex flex-row my-4'>
                    <Avatar src={avator || ''} />
                    <div className='ml-3 text-sm text-gray-400 mt-2'>
                      {msg?.isUser ? userName || 'User' : 'AI'}
                    </div>
                  </div>
                  <div className='ml-3'>{msg?.content}</div>
                </div>
              );
            })}
          </div>
          <div className='h-[2.5rem] mb-3'>
            <TextArea
              value={content}
              onChange={event => {
                if (event.target.value.trim() === '') {
                  return;
                }
                setContent(event.target.value);
              }}
              onPressEnter={event => handlePressEnter(event)}
              placeholder='Please input enter to use chat'
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssistantCard;
