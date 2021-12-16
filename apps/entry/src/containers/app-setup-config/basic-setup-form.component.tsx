import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import { Form, Input, Select } from "antd";
import { Rule } from "antd/lib/form";
import { UploadFile } from "antd/lib/upload/interface";
import { useAppDispatch, useAppSelector } from "@/store";
import { Icon } from "@common/components";
import { nameRule, NavModeType, remarkRule } from "@/consts";
import {
  basicErrorSelector,
  setBaseForm,
} from "@views/app-setup/basic-setup.slice";
import NavMode from "./nav-mode.component";
import Theme from "./theme.component";
import UploadImage from "./upload-image.component";
import "@containers/app-setup-config/basic-setup-form.style";

interface BasicSetupFormProps {
  workspaceList: { id: number; name: string }[];
  initialBasicSetup?: any;
}
const { Option } = Select;

const BasicSetupFormComponent = React.forwardRef(function basicSetupForm(
  { workspaceList, initialBasicSetup }: BasicSetupFormProps,
  ref
) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const basicError = useAppSelector(basicErrorSelector);

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
  const initialValues = useMemo(() => {
    const values = {
      navMode: NavModeType.MULTI,
      theme: "light",
    };
    return Object.assign({}, values, initialBasicSetup);
  }, [initialBasicSetup]);

  const handleValuesChange = useCallback(() => {
    const formValues = form.getFieldsValue();
    dispatch(setBaseForm(formValues));
  }, []);

  useImperativeHandle(ref, () => ({
    validateFields: () => form.validateFields(),
  }));

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (basicError?.length > 0) {
      form.validateFields();
    }
  }, [basicError]);

  return (
    <div className="basic-setup-form-component">
      <Form
        layout="vertical"
        autoComplete="off"
        form={form}
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
          <Select
            size="large"
            placeholder="请选择"
            disabled
            allowClear
            suffixIcon={<Icon type="xiala" />}
          >
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
