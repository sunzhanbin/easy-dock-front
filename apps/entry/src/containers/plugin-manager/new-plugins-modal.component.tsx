import React, { memo } from "react";
import { Form, Input, Modal, Select, Switch, Divider } from "antd";
import { nameRule } from "@/consts";
import { Icon } from "@common/components";
import { useAppSelector } from "@/store";
import { selectJsonMeta } from "@views/asset-centre/index.slice";

type ModalProps = {
  visible: boolean;
  onOK: (v: any) => void;
  onCancel: () => void;
};

const { Option } = Select;

const NewPluginsModalComponent = ({ visible, onCancel, onOK }: ModalProps) => {
  const jsonMeta = useAppSelector(selectJsonMeta);

  const [form] = Form.useForm();
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      onOK && onOK(values);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Modal
      className="upload-plugins-modal-container"
      title="新建插件"
      visible={visible}
      centered={true}
      onCancel={handleCancel}
      onOk={handleOk}
      width={400}
      maskClosable={false}
    >
      <div className="json-info">
        <p>
          <Icon type="wendangshangchuan" />
          <span>{jsonMeta?.name}</span>
        </p>
        <p className="code-text">插件code：{jsonMeta?.code}</p>
      </div>
      <Divider />

      <Form form={form} className="form" layout="vertical" autoComplete="off" preserve={false}>
        <Form.Item label="插件名称" name="name" required rules={[nameRule]}>
          <Input placeholder="请输入" size="large" />
        </Form.Item>
        <Form.Item
          label="插件分组"
          name="groupId"
          required
          rules={[
            {
              required: true,
              message: "请选择插件分组",
            },
          ]}
        >
          <Select size="large" placeholder="请选择插件分组" allowClear suffixIcon={<Icon type="xiala" />}>
            {[].map(({ id, name }: { id: number; name: string }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="是否启用" name="enabled" valuePropName="checked" className="switch-container">
          {/*checked={}*/}
          <Switch defaultChecked={false} />
        </Form.Item>
        <Form.Item label="是否公开" name="openVisit" valuePropName="checked" className="switch-container">
          {/*checked={}*/}
          <Switch defaultChecked={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(NewPluginsModalComponent);
