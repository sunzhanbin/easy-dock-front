import { useCallback } from "react";
import { Form, Input, Button, Select, Radio, Upload } from "antd";
import { useAppDispatch } from "@/store";
import { setTheme, setMode, setBaseForm } from "@views/app-setup/index.slice";
import { axios } from "@utils/fetch";

import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const normFile = (e: any) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const BasicFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleFormFinish = useCallback((values: any) => {
    dispatch(setBaseForm(values));
  }, []);

  const handleNavChange = useCallback((event: any) => {
    const { value } = event.target;
    dispatch(setMode(value));
    console.log("navMode::", value);
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
        .then(({ data: response }) => {
          onSuccess(response, file);
        })
        .catch(onError);
    },
    []
  );

  const handleLogoUploadChange = useCallback((props: any) => {
    console.log("handleLogoUploadChange", props);
  }, []);

  return (
    <div className="basic-form-component">
      <Form layout="vertical" form={form} onFinish={handleFormFinish}>
        <Form.Item
          label="应用名称"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="应用所属工作区"
          name="workspace"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Select placeholder="选择所属工作区" allowClear>
            <Option value="workspace1">工作区一</Option>
            <Option value="workspace2">工作区二</Option>
            <Option value="workspace3">工作区三</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="应用描述"
          name="remark"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Web页面导航"
          name="navMode"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Radio.Group onChange={handleNavChange}>
            <Radio value={0}>导航 1</Radio>
            <Radio value={1}>导航 2</Radio>
            <Radio value={2}>导航 3</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="应用主题"
          name="theme"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Radio.Group onChange={handleThemeChange}>
            <Radio value="theme1">主题 1</Radio>
            <Radio value="theme2">主题 2</Radio>
            <Radio value="theme3">主题 3</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="应用LOGO"
          name="icon"
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
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BasicFormComponent;
