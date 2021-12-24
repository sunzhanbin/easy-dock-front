import React, { memo, useCallback } from "react";
import { Modal, Form, Input } from "antd";
import SelectCard from "@components/select-card";
import { useAppSelector } from "@/store";
import { selectProjectId } from "@views/home/index.slice";
import "@components/select-card/index.style.scss";
import { useFetchWorkspaceListQuery, useAddWorkspaceMutation } from "@/http";
import { nameRule } from "@/consts";

type ModalProps = {
  modalInfo: { title: string; name: string; fieldKey: number };
  visible: boolean;
  onOk: (v: any) => void;
  onCancel: () => void;
};

const SELECT_CARD_TYPE = {
  key: "workspace",
  label: "工作区",
};

const NewSubAppModal = ({ modalInfo, visible, onOk, onCancel }: ModalProps) => {
  const [form] = Form.useForm();
  const projectId = useAppSelector(selectProjectId);
  const [addWorkspace] = useAddWorkspaceMutation();
  const { workspaceList } = useFetchWorkspaceListQuery(projectId, {
    selectFromResult: ({ data }) => ({
      workspaceList: data?.filter(Boolean),
    }),
  });
  const handleNewSubApp = useCallback(
    (name: any) => {
      return addWorkspace({ name, projectId });
    },
    [addWorkspace, projectId]
  );
  const handleSelectWorkspace = (value: any) => {
    form.setFieldsValue({ appId: value });
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const type = modalInfo.fieldKey;
      onOk && onOk({ ...values, type });
      form.resetFields();
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
          rules={[nameRule]}
        >
          <Input placeholder="请输入" size="large" />
        </Form.Item>
        <Form.Item
          label={`${modalInfo.name}所属工作区`}
          name="appId"
          rules={[
            {
              required: true,
              message: `请选择${modalInfo.name}所属工作区`,
            },
          ]}
        >
          <SelectCard
            type={SELECT_CARD_TYPE}
            list={workspaceList}
            onAdd={handleNewSubApp}
            onSelect={handleSelectWorkspace}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(NewSubAppModal);
