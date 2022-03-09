import React, { memo, useState } from "react";
import { Modal } from "antd";
import UploadJsonComponent from "@containers/plugin-manager/upload-json.component";
import "@containers/plugin-manager/upload-json-component.style.scss";
import { PluginMeta } from "@common/type";

type ModalProps = {
  visible: boolean;
  onOK: (v: any) => void;
  onCancel: () => void;
};

const UploadJsonModalComponent = ({ visible, onCancel, onOK }: ModalProps) => {
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const handleOk = () => {
    onOK && onOK(11);
  };
  const handleSuccess = (values: PluginMeta) => {
    console.log(values, "-----");
  };
  return (
    <Modal
      title="新建插件"
      visible={visible}
      centered={true}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="下一步"
      destroyOnClose={true}
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
