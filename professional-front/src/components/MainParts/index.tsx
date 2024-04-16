import ImageCarousel from '@/components/ImageCarousel';
import TopReading from '@/components/TopReading';
import React from 'react';
import style from '@/app/enterprise/main/styles/style.module.css';
import DailyGuide from '@/components/DailyGuide';

interface MainPartsProps {
  isNormal: boolean;
}

const MainParts: React.FC<MainPartsProps> = ({ isNormal }) => {
  return (
    <div className={style.mainLayout}>
      <ImageCarousel width='72vw' height='46vh' />
      <div className={style.smallLayout}>
        <TopReading width='36vw' height='40vh' />
        {isNormal ? <div></div> : <DailyGuide width='36vw' height='40vh' />}
      </div>
    </div>
  );
};

export default MainParts;
