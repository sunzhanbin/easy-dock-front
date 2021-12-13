import React, { useCallback, useImperativeHandle } from "react";
import { Form, Input, Button, Select, Radio, Upload } from "antd";
import { useAppDispatch, useAppSelector } from "@/store";
import { useFetchWorkspaceListQuery } from "@/http";
import { nameRule, remarkRule } from "@/consts";
import {
  setTheme,
  setMode,
  setBaseForm,
} from "@views/app-setup/basic-setup.slice";
import { axios } from "@utils/fetch";
import { UploadOutlined } from "@ant-design/icons";
import { selectProjectId } from "@/views/home/index.slice";
import NavMode from "./nav-mode.component";
import "@containers/app-setup-config/basic-setup-form.style";

const { Option } = Select;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const BasicSetupFormComponent = React.forwardRef<{
  validateFields: () => Promise<any>;
}>(function basicSetupForm(_, ref) {
  const projectId = useAppSelector(selectProjectId);
  const { data: workspaceList } = useFetchWorkspaceListQuery(projectId);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleFormFinish = useCallback((_, values: any) => {
    dispatch(setBaseForm(values));
  }, []);

  const handleNavChange = useCallback((event: any) => {
    const { value } = event.target;
    dispatch(setMode(value));
  }, []);

  const handleThemeChange = useCallback((event: any) => {
    const { value } = event.target;
    dispatch(setTheme(value));
    console.log("theme::", value);
  }, []);

  const handleCustomRequest = useCallback(
    ({ file, filename, onError, onSuccess }) => {
      const formData = new FormData();
      formData.append(filename, file);
      axios
        .post(`/file/batchUpload?controlType=1`, formData)
        .then(({ data: response }: any) => {
          onSuccess(response, file);
        })
        .catch(onError);
    },
    []
  );

  const handleLogoUploadChange = useCallback((props: any) => {
    console.log("handleLogoUploadChange", props);
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
        onValuesChange={handleFormFinish}
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
          <Radio.Group onChange={handleThemeChange}>
            <Radio value="theme1">主题 1</Radio>
            <Radio value="theme2">主题 2</Radio>
            <Radio value="theme3">主题 3</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="应用LOGO"
          name="icon"
          required
          valuePropName="fileList"
          getValueFromEvent={normFile}
          // rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Upload
            name="files"
            listType="picture"
            customRequest={handleCustomRequest}
            onChange={handleLogoUploadChange}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </div>
  );
});

export default BasicSetupFormComponent;
