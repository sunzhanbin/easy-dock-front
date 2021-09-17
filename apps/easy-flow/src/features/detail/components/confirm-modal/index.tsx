import { memo, useCallback, useState, useMemo, useEffect } from 'react';
import { Form, Modal, Input } from 'antd';

export enum ActionType {
  Approve = 1, // 同意
  Revert = 2, // 驳回
  Terminate = 3, // 终止
  Cancel = 4, // 取消操作
  Revoke = 5, // 撤回操作
}

interface ConfirmModalProps {
  onConfirm(remark: string): Promise<void>;
  onCanel(): void;
  type: ActionType;
  visble: boolean;
}

function ComfirmModal(props: ConfirmModalProps) {
  const { onConfirm, onCanel, type, visble } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleConfirm = useCallback(async () => {
    if (onConfirm) {
      setLoading(true);

      try {
        const remark = form.getFieldValue('remark');

        await onConfirm(remark ? remark.trim() : '');
      } finally {
        setLoading(false);
      }
    }
  }, [form, onConfirm]);

  const okText = useMemo(() => {
    if (type === ActionType.Approve) {
      return '同意';
    }

    if (type === ActionType.Revert) {
      return '驳回';
    }

    if (type === ActionType.Terminate) {
      return '终止';
    }

    if (type === ActionType.Revoke) {
      return '撤回';
    }

    return '' as never;
  }, [type]);

  useEffect(() => {
    if (!visble) {
      form.resetFields();
    }
  }, [visble, form]);

  return (
    <Modal
      visible={visble}
      onCancel={onCanel}
      onOk={handleConfirm}
      title="确认"
      okText={okText}
      okButtonProps={{ type: 'primary', danger: type !== ActionType.Approve, size: 'large', loading }}
      cancelButtonProps={{ size: 'large' }}
      destroyOnClose
      getContainer={false}
      keyboard={false}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item label="处理反馈" name="remark">
          <Input.TextArea maxLength={200} placeholder="请输入反馈意见, 也可不填直接提交" rows={4} autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(ComfirmModal);
