import { memo, useState } from 'react';
import classnames from "classnames";
import "swiper/swiper.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Mousewheel } from "swiper";
import ASCIIGalaxy from "@views/main/ascii-galaxy.component";
import AnimateScreenScroll from "@views/main/animate-screen-scroll";
import BubbleSvgComponent from "@views/main/bubble-svg.component";
import '@views/main/index.style.scss';
SwiperCore.use([Mousewheel]);

const Main = () => {
  const [screenIndex, setScreenIndex] = useState(0); // 当前是第几屏
  const handleSlideChange = (swiper: any) => {
    setScreenIndex(swiper.realIndex)
  }
  return <>
    <Swiper direction={'vertical'} slidesPerView={1} speed={800} spaceBetween={30} mousewheel={true} className="mySwiper" onSlideChange={handleSlideChange}>
      <SwiperSlide>
        <div className="slide-screen-one">
          <ASCIIGalaxy />
          <BubbleSvgComponent/>
          <div className="project-name">
            <p>低代码</p>
            <p>数字孪生平台</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="slide-screen-second">
          {screenIndex === 1 && <AnimateScreenScroll />}
        </div>
      </SwiperSlide>
    </Swiper>
  </>;
};
export default memo(Main);
