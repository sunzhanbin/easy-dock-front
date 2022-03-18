import { memo } from "react";
import { Modal, Form, Input, Radio } from "antd";
import { nameRule } from "@/consts";
import LinkedUserComponent from "@components/header/linked-user.component";

type modalProps = {
  visible: boolean;
  onOk: (v: any) => void;
  onCancel: () => void;
};
const NewProjectModalComponent = ({ visible, onOk, onCancel }: modalProps) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { tenant, name } = values;
      const params = {
        code: tenant.link ? tenant.code : null,
        name,
      };
      onOk && onOk(params);
      // form.resetFields();
    } catch (e) {
      console.log(e);
    }
  };
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
      <Form
        form={form}
        initialValues={{ tenant: { link: "" } }}
        className="form"
        layout="vertical"
        autoComplete="off"
        preserve={false}
      >
        <Form.Item label="关联租户" required>
          <Form.Item name={["tenant", "link"]} noStyle>
            <Radio.Group>
              <Radio value="">创建同名租户</Radio>
              <Radio value="2">关联已有租户</Radio>
            </Radio.Group>
          </Form.Item>
          <LinkedUserComponent form={form} />
        </Form.Item>
        <Form.Item label="项目名称" name="name" required rules={[nameRule]}>
          <Input placeholder="请输入" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(NewProjectModalComponent);
