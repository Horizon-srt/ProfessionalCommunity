import React, { useState } from 'react';
import { defaultImageCarousel } from '@/types/data-types';
import { Carousel, Image } from 'antd';

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
          <div key={value}>
            <Image
              src={value}
              alt={'Community pictures'}
              width={'100%'}
              height={'100%'}
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export default ImageCarousel;
