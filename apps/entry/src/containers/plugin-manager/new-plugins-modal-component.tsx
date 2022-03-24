import React, { memo, useEffect, useMemo } from "react";
import { Form, Input, Modal, Select, Switch, Divider } from "antd";
import { nameRule } from "@/consts";
import { Icon } from "@common/components";
import { useAppSelector } from "@/store";
import { selectJsonMeta } from "@views/asset-centre/index.slice";
import { GroupItem, TableColumnsProps } from "@utils/types";
import { getPopupContainer } from "@utils/utils";
import classnames from "classnames";

type ModalProps = {
  groupList: GroupItem[];
  editItem?: TableColumnsProps | null;
  visible: boolean;
  onOK: (v: any) => void;
  onCancel: () => void;
};

const { Option } = Select;
type FormValuesType = {
  name: string;
  group: any;
  openVisit: boolean;
  enabled: boolean;
};
const NewPluginsModalComponent = ({ groupList, editItem, visible, onCancel, onOK }: ModalProps) => {
  const [form] = Form.useForm<FormValuesType>();
  const jsonMeta = useAppSelector(selectJsonMeta);

  useEffect(() => {
    const values: any = editItem || jsonMeta;
    const group = values?.group;
    form.setFieldsValue({
      name: values?.name,
      group: group ? { value: group?.id } : undefined,
      openVisit: values?.openVisit === false ? values?.openVisit : true,
      enabled: values?.enabled === false ? values?.enabled : true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem, jsonMeta]);

  const pluginsParams: any = useMemo(() => {
    return editItem || jsonMeta;
  }, [editItem, jsonMeta]);

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const params = {
        ...pluginsParams,
        ...values,
      };
      delete params.group;
      params.groupId = values?.group?.value;
      onOK && onOK(params);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      className="upload-plugins-modal-container"
      title={`${editItem ? "编辑" : "新增"}插件`}
      visible={visible}
      centered={true}
      zIndex={11}
      onCancel={handleCancel}
      onOk={handleOk}
      width={400}
      destroyOnClose={true}
      getContainer={false}
      maskClosable={false}
      okButtonProps={{ size: "large" }}
      cancelButtonProps={{ size: "large" }}
    >
      <div className="json-info">
        {!editItem && (
          <p>
            <Icon type="wendangshangchuan" />
            <span>{jsonMeta.fileName}</span>
          </p>
        )}
        <p className="code-text">
          <span className={classnames("json-code", !editItem ? "padding-code" : "")}>{pluginsParams?.code}</span> ·
          插件编码
        </p>
        <Divider />
      </div>
      <Form form={form} className="form" layout="vertical" autoComplete="off" preserve={false}>
        <Form.Item label="插件名称" name="name" required rules={[nameRule]}>
          <Input placeholder="请输入" size="large" />
        </Form.Item>
        <Form.Item
          label="插件分组"
          name="group"
          required
          rules={[
            {
              required: true,
              message: "请选择插件分组",
            },
          ]}
        >
          <Select
            size="large"
            placeholder="请选择插件分组"
            getPopupContainer={getPopupContainer}
            suffixIcon={<Icon type="xiala" />}
            labelInValue={true}
          >
            {groupList?.map((item: GroupItem) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="是否公开" name="openVisit" valuePropName="checked" className="switch-container">
          <Switch defaultChecked={true} />
        </Form.Item>
        <Form.Item label="是否启用" name="enabled" valuePropName="checked" className="switch-container">
          <Switch defaultChecked={true} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(NewPluginsModalComponent);
