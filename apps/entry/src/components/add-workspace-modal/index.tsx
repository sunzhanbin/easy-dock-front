import React, { useCallback, useState, useImperativeHandle } from "react";
import { Modal, Form, Input, message } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { setCurrentWorkspaceId } from "@views/app-manager/index.slice";
import { nameRule } from "@/consts";
import { useAddWorkspaceMutation, useEditWorkspaceMutation } from "@/http";
import { useAppDispatch } from "@/store";
import { useNavigate, useParams } from "react-router-dom";
import "./index.style.scss";

const AddWorkspaceModal = React.forwardRef(function AddWorkspace(_, ref) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projectId, workspaceId: appId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [workspaceId, setWorkspaceId] = useState<number>(0);
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
    setWorkspace: ({ name, id }: { name: string; id: number }) => {
      form.setFieldsValue({ name });
      setWorkspaceId(id);
    },
  }));

  const handleVisible = useCallback((isVisible: boolean) => {
    setIsModalVisible(isVisible);
  }, []);

  const handleOk = useMemoCallback(async () => {
    form
      .validateFields()
      .then(async ({ name }) => {
        if (title === "新增") {
          const data = await addWorkspace({ name, projectId: Number(projectId) }).unwrap();
          message.success("新增成功!");
          // 如果添加的工作区是当前项目下的第一个工作区,则跳转至当前该工作区
          if (appId === "undefined") {
            navigate(`/app-manager/project/${projectId}/workspace/${data?.id}`, { replace: true });
          }
        } else {
          await editWorkspace({ name, id: workspaceId }).unwrap();
          message.success("修改成功!");
          dispatch(setCurrentWorkspaceId(workspaceId));
        }
        handleVisible(false);
      })
      .then(() => {
        form.resetFields();
      });
  });

  const handleCancel = useMemoCallback(() => {
    form.resetFields();
    handleVisible(false);
  });

  return (
    <Modal
      title={`${title}工作区`}
      okText="确定"
      cancelText="取消"
      wrapClassName="workspace-modal"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <Form form={form} autoComplete="off">
        <Form.Item name="name" label="工作区名称" required rules={[nameRule]}>
          <Input size="large" placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddWorkspaceModal;
