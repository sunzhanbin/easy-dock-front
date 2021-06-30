import { ReactNode, memo, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Modal, ModalProps, Button } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import classnames from 'classnames';
import AsyncButton from '../async-button';
import Icon from '../icon';
import styles from './index.module.scss';

interface CommonProps extends ModalProps {
  onClose?(): void;
  onOk?(): Promise<void> | void;
  children: ReactNode;
}

function ModalCom(props: CommonProps) {
  const {
    onClose,
    onCancel,
    onOk,
    okButtonProps,
    okText,
    footer,
    cancelText,
    cancelButtonProps,
    children,
    ...others
  } = props;
  const closeIcon = useMemo(() => {
    return <Icon className={styles.close} type="guanbi" onClick={onClose || onCancel} />;
  }, [onClose, onCancel]);

  const mFooter = useMemo(() => {
    if (footer === null) return null;

    if (footer) return footer;

    const okBtnProps = okButtonProps || { size: 'large', type: 'primary' };
    const cancelBtnProps = cancelButtonProps || { size: 'large', type: 'text' };

    return (
      <div className={styles.btns}>
        {cancelText && (
          <Button
            className={classnames(styles.cancel, cancelBtnProps.className)}
            {...cancelBtnProps}
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        )}
        <AsyncButton {...okBtnProps} onClick={onOk}>
          {okText}
        </AsyncButton>
      </div>
    );
  }, [footer, okButtonProps, okText, cancelButtonProps, cancelText, onOk, onCancel]);

  return (
    <Modal closeIcon={closeIcon} footer={mFooter} {...others}>
      {children}
    </Modal>
  );
}

export const ModalConfirm = memo(function Confirm(props: CommonProps) {
  const { title, children, ...others } = props;
  const mTtile = useMemo(() => {
    return (
      <div className={styles.title}>
        <ExclamationCircleFilled className={styles.confirm} />
        {title}
      </div>
    );
  }, [title, confirm]);

  return (
    <ModalCom {...others} title={mTtile}>
      {children}
    </ModalCom>
  );
});

export default memo(ModalCom);

interface ConfirmParams {
  title?: string;
  text: string;
  onClose?(): void;
  onCancel?(): void;
  onEnsure?(): void | Promise<any>;
  width?: number;
  okText?: string;
  cancelText?: string;
}

export const confirm = function (params: ConfirmParams, container?: HTMLElement) {
  let domContainer = container;

  if (!domContainer) {
    const div = document.createElement('div');

    domContainer = div;
    document.body.appendChild(div);
  }

  const { title = '提示', text, onClose, onCancel, onEnsure, width, okText, cancelText } = params;

  const closeModal = () => {
    render(false);

    setTimeout(close, 350);
  };

  const hanldeCancel = async () => {
    if (onCancel) onCancel();

    closeModal();
  };

  const handleClose = async () => {
    if (onClose) onClose();

    closeModal();
  };

  const handleEnsure = async () => {
    if (onEnsure) {
      await onEnsure();
    }

    closeModal();
  };

  const render = (visible: boolean) => {
    ReactDOM.render(
      <ModalConfirm
        title={title}
        visible={visible}
        onClose={handleClose}
        onCancel={hanldeCancel}
        onOk={handleEnsure}
        children={text}
        width={width}
        okText={okText}
        cancelText={cancelText}
      />,
      domContainer!,
    );
  };

  render(true);

  const close = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(domContainer!);

    if (unmountResult && domContainer?.parentNode) {
      domContainer.parentNode.removeChild(domContainer);
    }
  };

  return close;
};
