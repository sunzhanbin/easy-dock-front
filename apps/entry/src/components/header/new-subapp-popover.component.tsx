import { memo, useState } from "react";
import Icon from "@assets/icon";
import { Popover, message } from "antd";
import { SUB_APP_LIST, NOT_SHOW_MODAL_SELECT } from "@utils/const";
import classnames from "classnames";
import "@components/header/new-subapp-popover.style.scss";
import { getPopupContainer } from "@utils/utils";
import NewSubAppModal from "@containers/home-manager/new-subapp-modal";
import {
  useCreateSupAppMutation,
  useGetCanvasIdMutation,
  useGetHolosceneIdMutation,
} from "@/http";
import { HomeSubAppType, ResponseType } from "@/consts";

const NewSubAppPopoverComponent = () => {
  const [createSubApp] = useCreateSupAppMutation();
  const [getHolosceneId] = useGetHolosceneIdMutation();
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
      if (type === HomeSubAppType.CANVAS) {
        const { data: canvasData }: ResponseType = await getCanvasId(data?.id);
        if (!canvasData) return;
        // 大屏跳转需要拼sso=true保证用户信息不丢失
        window.open(
          `http://10.19.248.238:28180/dashboard/${canvasData.refId}?sso=true`
        );
      } else if (type === HomeSubAppType.SPACE) {
        const { data: spaceData }: ResponseType = await getHolosceneId(
          data?.id
        );
        if (!spaceData) return;
        window.open(`http://10.19.248.238:9003/#/scene/${spaceData.refId}`);
      } else if (type === HomeSubAppType.FLOW) {
        window.open(
          `http://10.19.248.238:28303/builder/flow/bpm-editor/${data?.id}/flow-design`
        );
      } else if (type === HomeSubAppType.FORM) {
        window.open(
          `http://10.19.248.238:28303/builder/flow/bpm-editor/${data?.id}/form-design`
        );
      }
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
  };
  const renderContent = () => {
    return (
      <>
        {SUB_APP_LIST.map((item, index) => (
          <div className="sub-item-container" key={index}>
            <p className="sub-name">{item.name}</p>
            <div className="sub-list-container">
              {item.subList.map((sub, key) => (
                <div
                  className="container-list"
                  key={key}
                  onClick={() => handleNewSubAPP(sub)}
                >
                  <i className={classnames("sub-icon", sub.icon)} />
                  <Icon
                    className="icon_arrow"
                    type="custom-icon-jinrujiantou"
                  />
                  <span className="text">{sub.linkName}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };
  return (
    <Popover
      placement="bottom"
      className="pop-container"
      content={renderContent}
      trigger="hover"
      getPopupContainer={getPopupContainer}
    >
      <a className="add-icon">
        <Icon className="icon" type="custom-icon-xinzeng" />
      </a>
      {showModal && (
        <NewSubAppModal
          modalInfo={modalInfo}
          visible={showModal}
          onOk={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </Popover>
  );
};
export default memo(NewSubAppPopoverComponent);
