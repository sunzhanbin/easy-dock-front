import React, {
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { useAppSelector } from "@/store";
import { useAddWorkspaceMutation } from "@/http";
import { selectProjectId } from "@views/app-manager/index.slice";
import { Modal, Form, Input } from "antd";

const AddWorkspaceModal = React.forwardRef(function addWorkspace(_, ref) {
  const projectId = useAppSelector(selectProjectId);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [addWorkspace] = useAddWorkspaceMutation();
  const [form] = Form.useForm();
  const inputRef = useRef<any>("");

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

  const handleOk = useCallback(async () => {
    const value = inputRef.current.state.value;
    addWorkspace({ name: value, projectId });
    handleVisible(false);
  }, [addWorkspace, handleVisible, projectId]);

  const handleCancel = useCallback(() => {
    handleVisible(false);
  }, [handleVisible]);

  return (
    <Modal
      title="新增工作区"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form}>
        <Form.Item name="name" label="工作区名称" required>
          <Input size="large" placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddWorkspaceModal;
