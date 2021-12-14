import { useState } from "react";
import Icon from "@assets/icon";
import "@containers/home-manager/index.style.scss";
import NewSubAppModal from "@containers/home-manager/new-subapp-modal";
import { useNavigate } from "react-router-dom";

const APP_INFO = {
  title: "新建应用",
  name: "应用",
};

const HomeNewAPP = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleConfirm = () => {
    // todo workspaceId获取
    // navigate(`/app-manager/${workspaceId}`);

    setShowModal(false);
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const toApp = () => {
    setShowModal(true);
  };
  return (
    <div className="top_sider">
      <a className="new_app_wrapper" onClick={toApp}>
        <span className="icon_new_app">
          <Icon type="custom-icon-xinzeng" />
        </span>
        <span className="text_new_app">创建应用</span>
      </a>
      <NewSubAppModal
        modalInfo={APP_INFO}
        visible={showModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default HomeNewAPP;
