import "@containers/home-manager/new-sub.style.scss";
import { useState } from "react";
import Icon from "@assets/icon";
import { SUB_APP_LIST } from "@utils/const";
import classnames from "classnames";
import NewSubAppModal from "@containers/home-manager/new-subapp-modal";

const NOT_SHOW_MODAL_SELECT = [
  "icon_shuju",
  "icon_shujumoxing",
  "icon_newinterface",
];
const HomeNewSub = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<{ title: string; name: string }>({
    title: "",
    name: "",
  });

  const handleConfirm = () => {
    setShowModal(false);
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const handleNewSubAPP = (item: { [key: string]: string }) => {
    if (NOT_SHOW_MODAL_SELECT.includes(item.icon)) return;
    setShowModal(true);
    setModalInfo({
      title: item.text,
      name: item.linkName,
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
      <NewSubAppModal
        modalInfo={modalInfo}
        visible={showModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default HomeNewSub;
