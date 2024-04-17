import React, { useState } from 'react';
import { defaultImageCarousel } from '@/types/data-types';
import { Carousel, Image } from 'antd';
import style from './styles/style.module.css';
interface ImageCarouselProps {
  width: string;
  height: string;
  imageList?: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  width,
  height,
  imageList
}) => {
  const [showList] = useState(imageList ? imageList : defaultImageCarousel);

  return (
    <Carousel autoplay style={{ width: width, height: height }}>
      {showList.map(value => {
        return (
          <div key={value} style={{ width: '100%', height: '100%' }}>
            <Image
              className={style.image}
              src={value}
              alt={'Community pictures'}
              height={'45vh'}
              width={'65vw'}
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export default ImageCarousel;
