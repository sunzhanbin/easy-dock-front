import { memo } from "react";
import { Modal, Form, Input } from "antd";
import { nameRegexp } from "@utils/const";

type ModalProps = {
  modalInfo: { title: string; name: string };
  visible: boolean;
  onOk: (v: any) => void;
  onCancel: () => void;
};

const NewSubAppModal = ({ modalInfo, visible, onOk, onCancel }: ModalProps) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values, "values");
      form.resetFields();
      onOk && onOk(values);
    } catch (e) {
      console.log(e);
    }
  };
  const handleCancel = () => {
    console.log(111);
    form.resetFields();
    onCancel && onCancel();
  };
  return (
    <Modal
      className="new_subApp_modal"
      title={modalInfo.title}
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
        className="form"
        layout="vertical"
        autoComplete="off"
        preserve={false}
      >
        <Form.Item
          label={`${modalInfo.name}名称`}
          name="name"
          required
          rules={[
            {
              validator(_, value) {
                if (!value || !value.trim()) {
                  return Promise.reject(
                    new Error(`请输入${modalInfo.name}名称`)
                  );
                }
                if (!nameRegexp.test(value.trim())) {
                  return Promise.reject(
                    new Error("请输入1-30位的汉字、字母、数字、下划线")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入" size="large" />
        </Form.Item>
        <Form.Item
          label={`${modalInfo.name}所属工作区`}
          name="space"
          required
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.reject(
                    new Error(`请选择${modalInfo.name}所属工作区`)
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(NewSubAppModal);
