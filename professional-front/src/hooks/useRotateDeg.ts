import { useEffect, useState } from 'react';

const useRotateDeg = () => {
  const [rotateDeg, setRotateDeg] = useState(0);

  useEffect(() => {
    // const timmer = setInterval(() => {
    //   setRotateDeg(rotateDeg => (rotateDeg + 1) % 180);
    // }, 150);

    const animationCallback = () => {
      setRotateDeg(rotateDeg => (rotateDeg + 0.2) % 180);
      requestAnimationFrame(animationCallback);
    };

    const timmer = requestAnimationFrame(animationCallback);

    return () => {
      cancelAnimationFrame(timmer);
      // clearInterval(timmer);
    };
  }, []);

  return [rotateDeg];
};

export default useRotateDeg;
