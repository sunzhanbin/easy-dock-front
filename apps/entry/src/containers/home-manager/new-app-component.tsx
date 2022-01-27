import { useState } from "react";
import { Icon } from "@common/components";
import "@containers/home-manager/index.style.scss";
import NewSubAppModal from "@containers/home-manager/new-subapp-modal";
import { useNavigate } from "react-router-dom";
import { useSaveAppSetupMutation } from "@/http";
import { message } from "antd";
import { APP_TYPE, ResponseType } from "@/consts";
import { useAppDispatch, useAppSelector } from "@/store";
import { setBaseForm } from "@/views/app-setup/basic-setup.slice";
import { selectProjectId } from "@/views/home/index.slice";

const APP_INFO = {
  title: "新建应用",
  name: "应用",
  fieldKey: APP_TYPE,
};

const HomeNewAPP = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(selectProjectId);
  const [createApp] = useSaveAppSetupMutation();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleConfirm = async (values: any) => {
    try {
      const { name, appId: id } = values;
      const ret: ResponseType = await createApp({ name, id }).unwrap();
      message.success("创建成功!");
      setShowModal(false);
      // 清空应用基础配置,防止二次赋值引起的bug
      dispatch(setBaseForm({}));
      navigate(`/app-manager/project/${projectId}/workspace/${ret?.id}`);
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
      <span className="new_app_wrapper" onClick={toApp}>
        <span className="icon-new-app">
          <Icon type="xinzeng" className="icon-new" />
        </span>
        <span className="text_new_app">创建应用</span>
      </span>
      {showModal && (
        <NewSubAppModal modalInfo={APP_INFO} visible={showModal} onOk={handleConfirm} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default HomeNewAPP;
