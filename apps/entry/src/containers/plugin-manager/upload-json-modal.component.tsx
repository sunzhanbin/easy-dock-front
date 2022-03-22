import React, { memo } from "react";
import { Modal } from "antd";
import UploadJsonComponent from "@containers/plugin-manager/upload-json.component";
import "@containers/plugin-manager/upload-json-component.style.scss";
import { PluginDataConfig } from "@common/type";
import { setJSONMeta } from "@views/asset-centre/index.slice";
import { useAppDispatch } from "@/store";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { TableColumnsProps } from "@utils/types";

type ModalProps = {
  editItem?: TableColumnsProps | null;
  visible: boolean;
  onOK: () => void;
  onCancel: () => void;
};

const UploadJsonModalComponent = ({ editItem, visible, onCancel, onOK }: ModalProps) => {
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    onCancel && onCancel();
  };
  const handleOk = () => {
    onOK && onOK();
  };
  const handleSuccess = useMemoCallback((values: PluginDataConfig) => {
    dispatch(setJSONMeta(values));
  });
  return (
    <Modal
      title={editItem ? "升级" : "新建插件"}
      visible={visible}
      centered={true}
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnClose={true}
      okButtonProps={{ size: "large" }}
      cancelButtonProps={{ size: "large" }}
      okText={editItem ? "确认" : "下一步"}
      width={400}
      maskClosable={false}
    >
      <div className="upload-json-container">
        <UploadJsonComponent onSuccess={handleSuccess} />
      </div>
    </Modal>
  );
};
export default memo(UploadJsonModalComponent);
