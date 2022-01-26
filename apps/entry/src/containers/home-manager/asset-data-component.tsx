import "@containers/home-manager/asset-data.style.scss";
import { Icon } from "@common/components";
import { ASSETS_DATA_LIST } from "@utils/const";

const HeaderAssetData = () => {
  return (
    <div className="header_asset_data">
      <div className="name_wrapper">
        <p className="name">数据资产</p>
        <p className="info">
          <Icon type="xuanzeshijian" className="icon" />
          数据资产，帮助您从全局的视角审视和管理平台内的数据源、数据模型及数据接口。
        </p>
      </div>
      <div className="data_wrapper">
        {ASSETS_DATA_LIST.map((item, index) => (
          <div className="data" key={index}>
            <span className="text">{item.name}</span>
            <span className="num">{item.num}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderAssetData;
