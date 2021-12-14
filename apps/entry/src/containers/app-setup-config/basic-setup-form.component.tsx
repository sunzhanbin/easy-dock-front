import React, { useCallback, useImperativeHandle, useMemo } from "react";
import { Form, Input, Select } from "antd";
import { Rule } from "antd/lib/form";
import { UploadFile } from "antd/lib/upload/interface";
import { useAppDispatch, useAppSelector } from "@/store";
import { useFetchWorkspaceListQuery } from "@/http";
import { nameRule, remarkRule } from "@/consts";
import { setBaseForm } from "@views/app-setup/basic-setup.slice";
import { selectProjectId } from "@/views/home/index.slice";
import NavMode from "./nav-mode.component";
import Theme from "./theme.component";
import UploadImage from "./upload-image.component";
import "@containers/app-setup-config/basic-setup-form.style";

const { Option } = Select;

const BasicSetupFormComponent = React.forwardRef<{
  validateFields: () => Promise<any>;
}>(function basicSetupForm(_, ref) {
  const projectId = useAppSelector(selectProjectId);
  const { data: workspaceList } = useFetchWorkspaceListQuery(projectId);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleValuesChange = useCallback((_, values: any) => {
    dispatch(setBaseForm(values));
  }, []);

  const iconRule = useMemo<Rule>(() => {
    return {
      validator(_, value: UploadFile[]) {
        if (!value || value.length === 0) {
          return Promise.reject(new Error("请上传应用LOGO!"));
        }
        return Promise.resolve();
      },
    };
  }, []);

  useImperativeHandle(ref, () => ({
    validateFields: () => form.validateFields(),
  }));

  return (
    <div className="basic-setup-form-component">
      <Form
        layout="vertical"
        form={form}
        autoComplete="off"
        onValuesChange={handleValuesChange}
      >
        <Form.Item label="应用名称" name="name" required rules={[nameRule]}>
          <Input size="large" placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="应用所属工作区"
          name="workspace"
          rules={[{ required: true, message: "请选择应用所属工作区!" }]}
        >
          <Select size="large" placeholder="请选择" allowClear>
            {(workspaceList ?? []).map(
              ({ id, name }: { id: number; name: string }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              )
            )}
          </Select>
        </Form.Item>
        <Form.Item label="应用描述" name="remark" rules={[remarkRule]}>
          <Input.TextArea size="large" rows={4} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="Web页面导航" name="navMode">
          <NavMode />
        </Form.Item>
        <Form.Item label="应用主题" name="theme">
          <Theme />
        </Form.Item>
        <Form.Item label="应用LOGO" name="icon" required rules={[iconRule]}>
          <UploadImage />
        </Form.Item>
      </Form>
    </div>
  );
});

export default BasicSetupFormComponent;
