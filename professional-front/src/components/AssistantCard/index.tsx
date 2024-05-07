import React from 'react';
import { Avatar, Card } from 'antd';
import TextArea from 'antd/es/input/TextArea';

interface AssistantCardProps {
  // width: string;
  // height: string;
}

const AssistantCard: React.FC<AssistantCardProps> = () => {
  return (
    <div className='grow p-3'>
      <Card title='AI'>
        <div className='flex flex-col justify-between w-full'>
          <div className='h-48 p-2 overflow-auto'>
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
          <div className='grow'>
            <TextArea />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssistantCard;
