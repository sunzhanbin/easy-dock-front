import React, {
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { useAppSelector } from "@/store";
import { useAddWorkspaceMutation } from "@/http/app-manager.hooks";
import { selectProjectId } from "@/views/app-manager/index.slice";
import { Modal, Input } from "antd";

const AddWorkspaceModal = React.forwardRef(function addWorkspace(_, ref) {
  const projectId = useAppSelector(selectProjectId);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [addWorkspace] = useAddWorkspaceMutation();
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
      title="Basic Modal"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      工作区名称：
      <Input ref={inputRef} />
    </Modal>
  );
});

export default AddWorkspaceModal;