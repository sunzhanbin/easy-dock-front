import { memo } from "react";
import { Modal, Form, Input, message, Radio } from "antd";
import { nameRule } from "@/consts";
import LinkedUserComponent from "@components/header/linked-user.component";

type modalProps = {
  visible: boolean;
  onOk: (v: any) => void;
  onCancel: () => void;
};
const NewProjectModalComponent = ({ visible, onOk, onCancel }: modalProps) => {
  const [form] = Form.useForm();

  const handleOk = () => {};
  const handleCancel = () => {
    form.resetFields();
    onCancel && onCancel();
  };
  return (
    <Modal
      title="创建项目"
      visible={visible}
      centered={true}
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnClose={true}
      width={400}
      maskClosable={false}
    >
      <Form form={form} className="form" layout="vertical" autoComplete="off" preserve={false}>
        <Form.Item label="项目名称" name="name" required rules={[nameRule]}>
          <Input placeholder="请输入" size="large" />
        </Form.Item>
        <Form.Item
          label="关联租户"
          required
          rules={[
            {
              required: true,
              message: "请选择关联租户",
            },
          ]}
        >
          <Form.Item name="appId" noStyle>
            <Radio.Group>
              <Radio value="1">自动创建同名新租户</Radio>
              <Radio value="2">关联已有租户</Radio>
            </Radio.Group>
          </Form.Item>
          <LinkedUserComponent form={form} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(NewProjectModalComponent);
