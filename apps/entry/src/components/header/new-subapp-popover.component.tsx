import { memo, useState } from "react";
import { Icon } from "@common/components";
import { Popover, message } from "antd";
import { SUB_APP_LIST, NOT_SHOW_MODAL_SELECT } from "@utils/const";
import classnames from "classnames";
import "@components/header/new-subapp-popover.style.scss";
import { getPopupContainer, JumpLinkToUrl } from "@utils/utils";
import NewSubAppModal from "@containers/home-manager/new-subapp-modal";
import { useCreateSupAppMutation, useGetCanvasIdMutation, useGetHoloSceneIdMutation } from "@/http";
import { HomeSubAppType, INTERFACE_ENTRY, ResponseType, IOT_ENTRY, DATA_FISH_ENTRY } from "@/consts";

const NewSubAppPopoverComponent = () => {
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
      const ret: ResponseType = await createSubApp(values).unwrap();
      const { type = 0 } = values;
      await JumpLinkToUrl(type, ret?.id, getCanvasId, getHoloSceneId);
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
        window.open(`${IOT_ENTRY}/product`);
      } else if (type === HomeSubAppType.INTERFACE) {
        window.open(`${INTERFACE_ENTRY}/orch`);
      } else if (type === HomeSubAppType.DATA_FISH) {
        window.open(`${DATA_FISH_ENTRY}/#/modelManagement?theme=light`);
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
                <div className="container-list" key={key} onClick={() => handleNewSubAPP(sub)}>
                  <i className={classnames("sub-icon", sub.icon)} />
                  <Icon className="icon_arrow" type="jinrujiantou" />
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
      <span className="add-icon">
        <Icon className="icon" type="xinzeng" />
      </span>
      {showModal && (
        <NewSubAppModal modalInfo={modalInfo} visible={showModal} onOk={handleConfirm} onCancel={handleCancel} />
      )}
    </Popover>
  );
};
export default memo(NewSubAppPopoverComponent);
