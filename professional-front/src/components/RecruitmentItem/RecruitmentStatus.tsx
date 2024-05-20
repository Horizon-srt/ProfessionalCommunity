import React from 'react';

export const RecruitStatus = ({ status }: { status: string }) => {
  if (status === 'approved') {
    return <div className='text-green-400'>Approved</div>;
  } else if (status === 'pending') {
    return <div className='text-gray-400'>Pending</div>;
  } else {
    return <div className='text-gray-400'>{status}</div>;
  }
};
