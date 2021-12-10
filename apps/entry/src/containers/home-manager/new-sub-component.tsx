import "@containers/home-manager/new-sub.style.scss";
import Icon from "@assets/icon";
import {
  CREATE_BUSINESS_LIST,
  CREATE_DATA_LIST,
  CREATE_VIRTUAL_LIST,
} from "@utils/const";
import classnames from "classnames";

const HomeNewSub = () => {
  return (
    <div className="banner">
      <div className="create_data banner_content">
        <div className="data_info_top">
          <p className="text_wrapper">
            <span className="text">数据构建</span>
            <span className="circle" />
          </p>
          <p className="info">轻松融合海量数据，优化、清晰、 有序</p>
        </div>
        <div className="data_info_bottom">
          {CREATE_DATA_LIST.map((item, index) => (
            <div className="operation_wrapper" key={index}>
              <div className="container">
                <i className={classnames("icon", item.icon)} />
                <span className="text">{item.text}</span>
                <Icon className="icon_arrow" type="custom-icon-jinrujiantou" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="create_business banner_content">
        <div className="data_info_top">
          <p className="text_wrapper">
            <span className="text">业务构建</span>
            <span className="circle" />
          </p>
          <p className="info">无码化搭建，快速完成业务信息化</p>
        </div>
        <div className="data_info_bottom">
          {CREATE_BUSINESS_LIST.map((item, index) => (
            <div className="operation_wrapper" key={index}>
              <div className="container">
                <i className={classnames("icon", item.icon)} />
                <span className="text">{item.text}</span>
                <Icon className="icon_arrow" type="custom-icon-jinrujiantou" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="create_virtual banner_content">
        <div className="data_info_top">
          <p className="text_wrapper">
            <span className="text">可视化构建</span>
            <span className="circle" />
          </p>
          <p className="info">多角度呈现可视化数据，极速搭建页面</p>
        </div>
        <div className="data_info_bottom">
          {CREATE_VIRTUAL_LIST.map((item, index) => (
            <div
              className={classnames(
                "operation_wrapper",
                index !== 0 ? "orange" : ""
              )}
              key={index}
            >
              <div className="container">
                <i className={classnames("icon", item.icon)} />
                <span className="text">{item.text}</span>
                <Icon className="icon_arrow" type="custom-icon-jinrujiantou" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeNewSub;
