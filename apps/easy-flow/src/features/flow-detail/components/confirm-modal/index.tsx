import { memo, useCallback, useState } from 'react';
import { Form, Modal, Input } from 'antd';

interface ConfirmModalProps {
  onConfirm(remark: string): Promise<void>;
  onCanel(): void;
  isApprove: boolean;
  visble: boolean;
}

function ComfirmModal(props: ConfirmModalProps) {
  const { onConfirm, onCanel, isApprove, visble } = props;
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

  return (
    <Modal
      visible={visble}
      onCancel={onCanel}
      onOk={handleConfirm}
      title="确认"
      okText={isApprove ? '同意' : '驳回'}
      okButtonProps={{ type: 'primary', danger: !isApprove, size: 'large', loading }}
      cancelButtonProps={{ size: 'large' }}
      destroyOnClose
      getContainer={false}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item label="处理反馈" name="remark">
          <Input.TextArea maxLength={200} placeholder="请输入反馈意见, 也可不填直接提交" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(ComfirmModal);
