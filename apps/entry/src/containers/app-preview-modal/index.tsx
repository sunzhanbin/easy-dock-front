import { memo, FC } from "react";
import { Modal } from "antd";
import classNames from "classnames";
import { Icon } from "@common/components";
import AppSetupPreview from "@containers/app-setup-preview";

import "./index.style.scss";

interface AppPreviewModalProps {
  theme?: string;
  visible: boolean;
  onClose: () => void;
}

const AppPreviewModal: FC<AppPreviewModalProps> = ({ visible, theme = "light", onClose }) => {
  return (
    <div className={classNames("app-preview-container", !visible && "hidden")}>
      <Modal
        className="app-preview-modal"
        visible={visible}
        title={null}
        footer={null}
        width="100%"
        destroyOnClose={true}
        getContainer={false}
        onCancel={onClose}
      >
        <AppSetupPreview />
      </Modal>
      <div className={classNames("close", theme)} onClick={onClose}>
        <Icon className="icon" type="guanbi" />
      </div>
    </div>
  );
};

export default memo(AppPreviewModal);
