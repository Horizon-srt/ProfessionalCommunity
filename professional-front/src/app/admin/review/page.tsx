'use client';
import React, { useState } from 'react';
import PersonalReview from '@/components/PersonalReview';
import { Button } from 'antd';
import RecruitReview from '@/components/RecuritReview';

const ReviewPage: React.FC = () => {
  const [current, setCurrent] = useState<'profile' | 'recruit'>('profile');
  return (
    <div>
      <Button
        onClick={() => {
          setCurrent('profile');
        }}
      >
        Profile
      </Button>
      <Button
        onClick={() => {
          setCurrent('recruit');
        }}
      >
        Recruit
      </Button>
      {current === 'profile' && <PersonalReview />}
      {current === 'recruit' && <RecruitReview />}
    </div>
  );
};

export default ReviewPage;
