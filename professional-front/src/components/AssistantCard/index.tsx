'use client';
import React from 'react';
import { Avatar } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Card from '@/components/Card';
import { useStore } from '@/hooks/useStore';

interface AssistantCardProps {
  // width: string;
  // height: string;
}

const AssistantCard: React.FC<AssistantCardProps> = () => {
  const isExpand = useStore(state => state.userInfoIsExpand);

  const assistantCardIsExpandStyle = `${isExpand ? 'h-[40%]' : 'h-[80%]'}`;
  return (
    <div
      className={`p-3 justify-end transition-all ${assistantCardIsExpandStyle}`}
    >
      <Card title='AI'>
        <div className='h-50 flex flex-col w-full justify-between'>
          <div className={`p-2 overflow-auto ${isExpand ? 'h-[3rem]' : ''}`}>
            <div className='flex flex-row'>
              <div>
                <Avatar />
              </div>
              <div>
                <div className='ml-3 text-sm text-gray-400'>Balzac</div>
                <div className='ml-3'>
                  efewiofhweoifewiofjewiofefeiwewefewiofewfioe
                  efewiofhweoifewiofjewiofefeiwewefewiofewfioee
                  fewiofhweoifewiofjewiofefeiwewefewiofewfioe
                </div>
              </div>
            </div>
          </div>
          <div className='h-[2.5rem] mb-3'>
            <TextArea />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssistantCard;
