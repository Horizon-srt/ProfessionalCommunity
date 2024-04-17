import { Avatar, Divider } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
import Card from '../Card';

const SideBar: React.FC = () => {
  return (
    <div className='flex flex-col h-full'>
      <div className='h-40 p-3 h-1/6'>
        <Card title='Personal'>
          <div className='flex flex-row w-full bg-white h-8'>
            <div className='w-3/12'>
              <Avatar />
            </div>
            <div className='w-9/12 flex flex-col'>
              <div className='text-base text-right font-bold'>San Zhang</div>
              <div className='text-sm text-right text-gray-400'>
                Owner of Room 323, Unit 1, No. 14
              </div>
              <Divider />
            </div>
          </div>
        </Card>
      </div>
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
    </div>
  );
};

export default SideBar;
