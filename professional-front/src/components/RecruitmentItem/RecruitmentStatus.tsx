import { RecruitmentStatus } from '@/types/data-types';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

export const RecruitStatus = ({ status }: { status: RecruitmentStatus }) => {
  if (status === RecruitmentStatus.APPROVED) {
    return <div className='text-green-400'>Approved</div>;
  } else if (status === RecruitmentStatus.APPROVING) {
    return <div className='text-gray-400'>Approving</div>;
  } else if (status === RecruitmentStatus.NOTAPPROVED) {
    return <div className='text-gray-400'>Not Approved</div>;
  } else {
    return <></>;
  }
};
