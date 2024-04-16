import React from 'react';

interface ICard {
  children: React.ReactNode;
  title?: string;
}
const Card: React.FC<ICard> = ({ children, title }) => {
  return (
    <div className='w-full h-full flex flex-col bg-white p-4 rounded-md border-2 border-stone-100'>
      {title ? <div className='mb-4 font-bold'>{title}</div> : null}
      <div className='flex flex-row w-full h-full bg-white'>{children}</div>
    </div>
  );
};
export default Card;
