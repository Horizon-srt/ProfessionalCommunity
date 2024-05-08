/* eslint-disable max-len */
import React from 'react';

interface ICard {
  children: React.ReactNode;
  title?: string | React.ReactNode;
}
const Card: React.FC<ICard> = ({ children, title }) => {
  const darkModeStyle = ' dark:bg-black';
  return (
    <div
      className={
        'w-full h-full flex flex-col bg-white p-4 rounded-md border-2 border-stone-100' +
        darkModeStyle
      }
    >
      {title ? (
        <div className='mb-4 font-bold dark:text-white'>{title}</div>
      ) : null}
      <div className='flex flex-row w-full h-full bg-white dark:bg-black dark:text-white'>
        {children}
      </div>
    </div>
  );
};
export default Card;
