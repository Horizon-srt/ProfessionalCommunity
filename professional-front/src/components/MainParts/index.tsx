import ImageCarousel from '@/components/ImageCarousel';
import TopReading from '@/components/TopReading';
import React, { useEffect, useState } from 'react';
// import style from '@/components/MainParts/styles/style.module.css';
import DailyGuide from '@/components/DailyGuide';
import { Col, Row } from 'antd';
import ResourceCard from '@/components/ResourceCard';
import NoticeCard from '../NoticeCard';

interface MainPartsProps {
  isNormal: boolean;
}

const MainParts: React.FC<MainPartsProps> = ({ isNormal }) => {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    setStatus(localStorage.getItem('user-status') || 'pending');
  }, []);

  return (
    <>
      <Row style={{ width: '100%', height: '50%' }}>
        <Col span={24} style={{ height: '100%' }}>
          <ImageCarousel width='100%' height='100%' />
        </Col>
      </Row>
      <Row style={{ width: '100%', height: '43vh', paddingTop: '1rem' }}>
        <Col span={12} style={{ paddingRight: '0.5rem' }}>
          <TopReading width='100%' height='100%' />
        </Col>
        <Col span={12} style={{ paddingLeft: '0.5rem' }}>
          {isNormal ? (
            <>
              {status === 'approved' ? (
                <ResourceCard width='100%' height='100%' />
              ) : (
                <NoticeCard width='100%' height='100%' />
              )}
            </>
          ) : (
            <DailyGuide width='100%' height='100%' />
          )}
        </Col>
      </Row>
    </>
  );
};

export default MainParts;
