import React, { useCallback, useState, useImperativeHandle } from "react";
import { useAppSelector } from "@/store";
import { useAddWorkspaceMutation } from "@/http";
import { selectProjectId } from "@views/home/index.slice";
import { Modal, Form, Input } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { nameRule } from "@/consts";

const AddWorkspaceModal = React.forwardRef(function addWorkspace(_, ref) {
  const projectId = useAppSelector(selectProjectId);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [addWorkspace] = useAddWorkspaceMutation();
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalVisible(true);
    },
    hide: () => {
      setIsModalVisible(false);
    },
  }));

  const handleVisible = useCallback((isVisible: boolean) => {
    setIsModalVisible(isVisible);
  }, []);

  const handleOk = useMemoCallback(async () => {
    form.validateFields().then(({ name }) => {
      addWorkspace({ name, projectId });
      handleVisible(false);
    });
  });

  const handleCancel = useCallback(() => {
    handleVisible(false);
  }, [handleVisible]);

  return (
    <Modal
      title="新增工作区"
      okText="确定"
      cancelText="取消"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form}>
        <Form.Item name="name" label="工作区名称" required rules={[nameRule]}>
          <Input size="large" placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddWorkspaceModal;
