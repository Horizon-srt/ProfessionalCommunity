import ImageCarousel from '@/components/ImageCarousel';
import TopReading from '@/components/TopReading';
import React from 'react';
import style from '@/components/MainParts/styles/style.module.css';
import DailyGuide from '@/components/DailyGuide';

interface MainPartsProps {
  isNormal: boolean;
}

const MainParts: React.FC<MainPartsProps> = ({ isNormal }) => {
  return (
    <div className={style.mainLayout}>
      <div className={style.bigLayout}>
        <ImageCarousel width='100%' height='100%' />
      </div>
      <div className={style.smallLayout}>
        <TopReading width='50%' height='100%' />
        {isNormal ? <div></div> : <DailyGuide width='50%' height='100%' />}
      </div>
    </div>
  );
};

export default MainParts;
