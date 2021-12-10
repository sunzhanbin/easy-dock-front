import Icon from "@assets/icon";
import "@containers/home-manager/index.style.scss";

const HomeNewAPP = () => {
  const toApp = () => {
    console.log("toApp");
  };
  return (
    <div className="top_sider">
      <a className="new_app_wrapper" onClick={toApp}>
        <span className="icon_new_app">
          <Icon type="custom-icon-xinzeng" />
        </span>
        <span className="text_new_app">创建应用</span>
      </a>
    </div>
  );
};

export default HomeNewAPP;
