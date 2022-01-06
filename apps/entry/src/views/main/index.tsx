import { memo, Fragment } from 'react';
import classnames from "classnames";
import "swiper/swiper.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Mousewheel } from "swiper";
import ASCIIGalaxy from "@views/main/ascii-galaxy.component";
import BubbleSvgComponent from "@views/main/bubble-svg.component";
import '@views/main/index.style.scss';
import { MAIN_SUB_APP_LIST } from "@utils/const";
SwiperCore.use([Mousewheel]);

const Main = () => {
  return <>
    <Swiper direction={'vertical'} slidesPerView={1} spaceBetween={30} mousewheel={true} className="mySwiper">
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
          <div className="bubble-list-wrapper">
            {
              MAIN_SUB_APP_LIST.map((circle, index) =>
                  <Fragment key={index}>
                    <div className={classnames(`circle-${index+1}`, "circle")}>
                      {(index + 1 === 8) && <span className="circle-text">创建应用</span>}
                    </div>
                  </Fragment>
            )}
          </div>
          <div className="sub-app-wrapper">
            { MAIN_SUB_APP_LIST.map((sub, index) =>
                <div className="sub-app-item" key={index}>
                  <i className={classnames(sub.icon, "sub-icon")}></i>
                  <span className="sub-text">{sub.text}</span>
                </div>
            )}
          </div>
        </div>

      </SwiperSlide>
    </Swiper>
  </>;
};
export default memo(Main);
