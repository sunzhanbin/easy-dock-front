import { memo, FC, useMemo } from "react";
import { Modal } from "antd";
import { Icon } from "@common/components";
import AppSetupPreview from "@containers/app-setup-preview";

import "./index.style.scss";

interface AppPreviewModalProps {
  visible: boolean;
  onClose: () => void;
}

const AppPreviewModal: FC<AppPreviewModalProps> = ({ visible, onClose }) => {
  const title = useMemo(() => {
    return (
      <div className="header">
        <div className="close" onClick={onClose}>
          <Icon className="iconfont" type="guanbi" />
        </div>
      </div>
    );
  }, [onClose]);
  return (
    <Modal
      className="app-preview-modal"
      visible={visible}
      title={title}
      footer={null}
      width="100%"
      destroyOnClose={true}
      onCancel={onClose}
    >
      <AppSetupPreview />
    </Modal>
  );
};

export default memo(AppPreviewModal);
