import React, { FC, memo } from "react";
import { Modal } from "antd";

type CheckJsonModalProps = {
  visible: boolean;
  onCancel: () => void;
  children: React.ReactElement<any, any>;
};

const CheckJsonModalComponent: FC<CheckJsonModalProps> = ({ visible, onCancel, children }) => {
  const handleCancel = () => {
    onCancel && onCancel();
  };
  return (
    <Modal
      title="查看json"
      visible={visible}
      centered={true}
      width={600}
      bodyStyle={{ maxHeight: "600px" }}
      footer={null}
      onCancel={handleCancel}
      maskClosable={false}
    >
      {children}
    </Modal>
  );
};

export default memo(CheckJsonModalComponent);
