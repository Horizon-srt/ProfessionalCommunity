import ImageCarousel from '@/components/ImageCarousel';
import TopReading from '@/components/TopReading';
import React from 'react';
// import style from '@/components/MainParts/styles/style.module.css';
import DailyGuide from '@/components/DailyGuide';
import { Col, Row } from 'antd';
import ResourceCard from '@/components/ResourceCard';

interface MainPartsProps {
  isNormal: boolean;
}

const MainParts: React.FC<MainPartsProps> = ({ isNormal }) => {
  return (
    <>
      <Row style={{ width: '100%', height: '55%' }}>
        <Col span={24} style={{ height: '100%' }}>
          <ImageCarousel width='100%' height='100%' />
        </Col>
      </Row>
      <Row style={{ width: '100%', height: '40%' }}>
        <Col span={12}>
          <TopReading width='100%' height='100%' />
        </Col>
        <Col span={12}>
          {isNormal ? (
            <ResourceCard width='100%' height='100%' />
          ) : (
            <DailyGuide width='100%' height='100%' />
          )}
        </Col>
      </Row>
    </>
  );
};

export default MainParts;
