import { useState } from "react";
import { Icon } from "@common/components";
import "@containers/home-manager/index.style.scss";
import NewSubAppModal from "@containers/home-manager/new-subapp-modal";
import { useNavigate } from "react-router-dom";
import { useSaveAppSetupMutation } from "@/http";
import { message } from "antd";
import { APP_TYPE, ResponseType } from "@/consts";

const APP_INFO = {
  title: "新建应用",
  name: "应用",
  fieldKey: APP_TYPE,
};

const HomeNewAPP = () => {
  const navigate = useNavigate();
  const [createApp] = useSaveAppSetupMutation();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleConfirm = async (values: any) => {
    try {
      const { name, appId: id } = values;
      const { data }: ResponseType = await createApp({ name, id });
      if (!data) return;
      message.success("创建成功!");
      setShowModal(false);
      navigate(`/app-manager/${data.id}`);
    } catch (e) {
      console.log(e);
    }
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
          <Icon type="xinzeng" />
        </span>
        <span className="text_new_app">创建应用</span>
      </a>
      {showModal && (
        <NewSubAppModal
          modalInfo={APP_INFO}
          visible={showModal}
          onOk={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default HomeNewAPP;
