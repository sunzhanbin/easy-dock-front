import "@containers/home-manager/new-sub.style.scss";
import { useState } from "react";
import Icon from "@assets/icon";
import { SUB_APP_LIST, NOT_SHOW_MODAL_SELECT } from "@utils/const";
import classnames from "classnames";
import NewSubAppModal from "@containers/home-manager/new-subapp-modal";
import { message } from "antd";
import {
  useCreateSupAppMutation,
  useGetCanvasIdMutation,
  useGetHoloSceneIdMutation,
} from "@/http";
import { ResponseType, HomeSubAppType } from "@/consts";
import { JumpLinkToUrl } from "@utils/utils";

const HomeNewSub = () => {
  const [createSubApp] = useCreateSupAppMutation();
  const [getHoloSceneId] = useGetHoloSceneIdMutation();
  const [getCanvasId] = useGetCanvasIdMutation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<{
    title: string;
    name: string;
    fieldKey: number;
  }>({
    title: "",
    name: "",
    fieldKey: 0,
  });

  const handleConfirm = async (values: any) => {
    try {
      const { data }: ResponseType = await createSubApp(values);
      const { type = 0 } = values;
      if (!data) return;
      await JumpLinkToUrl(type, data?.id, getCanvasId, getHoloSceneId);
      message.success("创建成功!");
      setShowModal(false);
    } catch (e) {
      console.log(e);
    }
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const handleNewSubAPP = (item: { [key: string]: any }) => {
    const { type } = item;
    if (NOT_SHOW_MODAL_SELECT.includes(type)) {
      if (type === HomeSubAppType.DEVICE) {
        // todo
        // window.open(`http://10.19.248.238:9003/#/scene/${id}`);
      } else if (type === HomeSubAppType.INTERFACE) {
        window.open("http://10.19.248.238:28217/orch");
      } else if (type === HomeSubAppType.DATA_FISH) {
        // todo
        // window.open(`http://10.19.248.238:9003/#/scene/${id}`);
      }
      return;
    }
    setShowModal(true);
    setModalInfo({
      title: item.text,
      name: item.linkName,
      fieldKey: type,
    });
    console.log(item, "item");
  };
  return (
    <div className="banner">
      {SUB_APP_LIST.map((sub, key) => (
        <div className={classnames(sub.className, "banner_content")} key={key}>
          <div className="data_info_top">
            <p className="text_wrapper">
              <span className="text">{sub.name}</span>
              <span className="circle" />
            </p>
            <p className="info">{sub.desc}</p>
          </div>
          <div className="data_info_bottom">
            {sub.subList.map((item, index) => (
              <div
                className={classnames(
                  "operation_wrapper",
                  sub.className === "create_virtual" && index !== 0
                    ? "orange"
                    : ""
                )}
                key={index}
                onClick={() => handleNewSubAPP(item)}
              >
                <div className="container">
                  <i className={classnames("icon", item.icon)} />
                  <span className="text">{item.text}</span>
                  <Icon
                    className="icon_arrow"
                    type="custom-icon-jinrujiantou"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {showModal && (
        <NewSubAppModal
          modalInfo={modalInfo}
          visible={showModal}
          onOk={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default HomeNewSub;
