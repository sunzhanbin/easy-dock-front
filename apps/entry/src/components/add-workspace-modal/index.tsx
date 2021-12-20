import React, { useCallback, useState, useImperativeHandle } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useAddWorkspaceMutation, useEditWorkspaceMutation } from "@/http";
import { selectProjectId } from "@views/home/index.slice";
import { Modal, Form, Input } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { nameRule } from "@/consts";
import {
  selectCurrentWorkspaceId,
  setCurrentWorkspaceId,
} from "@views/app-manager/index.slice";

const AddWorkspaceModal = React.forwardRef(function addWorkspace(_, ref) {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(selectProjectId);
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{
    [key: string]: string;
  }>({});
  const [title, setTitle] = useState<string>("");
  const [addWorkspace] = useAddWorkspaceMutation();
  const [editWorkspace] = useEditWorkspaceMutation();
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalVisible(true);
    },
    hide: () => {
      setIsModalVisible(false);
    },
    setTitle: (title: string) => {
      setTitle(title);
    },
    setWorkspaceName: (name: string) => {
      setInitialValues({ name });
      form.setFieldsValue({ name });
    },
  }));

  const handleVisible = useCallback((isVisible: boolean) => {
    setIsModalVisible(isVisible);
  }, []);

  const handleOk = useMemoCallback(async () => {
    form.validateFields().then(async ({ name }) => {
      if (title === "新增") {
        addWorkspace({ name, projectId });
      } else {
        await editWorkspace({ name, id: workspaceId });
        dispatch(setCurrentWorkspaceId(workspaceId));
      }
      handleVisible(false);
    });
  });

  const handleCancel = useCallback(() => {
    handleVisible(false);
  }, [handleVisible]);

  return (
    <Modal
      title={`${title}工作区`}
      okText="确定"
      cancelText="取消"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} initialValues={initialValues}>
        <Form.Item name="name" label="工作区名称" required rules={[nameRule]}>
          <Input size="large" placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddWorkspaceModal;
