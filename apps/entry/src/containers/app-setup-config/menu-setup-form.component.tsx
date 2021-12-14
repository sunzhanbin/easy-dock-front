import React, {
  ReactNode,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";
import { Form, Input, Select, Checkbox, Button, Radio } from "antd";
import { selectMenuForm, setMenuForm } from "@views/app-setup/menu-setup.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { MenuSetupForm } from "@utils/types";
import { nameRule } from "@/consts";

import "@containers/app-setup-config/menu-setup-form.style";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";

const { Option } = Select;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const MenuSetupFormComponent = React.forwardRef<{
  validateFields: () => Promise<any>;
}>(function menuSetupForm(_, ref) {
  const dispatch = useAppDispatch();
  const menuForm = useAppSelector(selectMenuForm);
  const [form] = Form.useForm();
  const containerRef = useRef<HTMLDivElement>(null);

  const iconList = useMemo<string[]>(() => {
    return [
      "shenhejilujinxingzhong",
      "shouyecaidan",
      "renwu",
      "shujujicheng",
      "jiankongliucheng",
      "diaoduyilai",
      "shujutancha",
      "shujujianmo",
      "shujubiao",
      "shujuyuan",
    ];
  }, []);

  const dropdownRender = useMemoCallback((originNode: ReactNode) => {
    return <div className="dropdown-container">{originNode}</div>;
  });

  const options = useMemo(() => {
    return [
      { label: "已有资产", value: "exist" },
      { label: "自定义URL", value: "custom" },
    ];
  }, []);

  const handleFormFinish = useCallback((values: MenuSetupForm) => {
    dispatch(setMenuForm(values));
  }, []);

  useImperativeHandle(ref, () => ({
    validateFields: () => form.validateFields(),
  }));

  useEffect(() => {
    form.setFieldsValue(menuForm);
  }, [menuForm]);

  return (
    <div className="menu-setup-form-component" ref={containerRef}>
      <div className="header">内容设置</div>
      <div className="form">
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleFormFinish}
        >
          <Form.Item label="菜单名称" name="name" required rules={[nameRule]}>
            <Input size="large" placeholder="请输入" />
          </Form.Item>
          <Form.Item label="菜单icon" name="icon">
            <Select
              size="large"
              placeholder="请选择"
              dropdownRender={dropdownRender}
              suffixIcon={<Icon type="xiala" />}
              getPopupContainer={() => containerRef.current!}
            >
              {iconList.map((icon) => (
                <Option key={icon} value={icon}>
                  <Icon type={icon} />
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="查看方式" name="mode">
            <Radio.Group size="large">
              <Radio value={0}>当前页面打开</Radio>
              <Radio value={1}>新窗口打开</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="内容设置">
            <Form.Item name="asset" className="asset-item">
              <Radio.Group
                size="large"
                optionType="button"
                className="asset-option"
                options={options}
              ></Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev, current) => prev.asset !== current.asset}
            >
              {({ getFieldValue }) =>
                getFieldValue("asset") === "custom" ? (
                  <Form.Item name={["assetConfig", "url"]}>
                    <Input size="large" placeholder="请输入URL" />
                  </Form.Item>
                ) : (
                  <>
                    <Form.Item
                      name={["assetConfig", "app"]}
                      className="app-item"
                    >
                      <Select
                        placeholder="选择应用"
                        size="large"
                        allowClear
                        suffixIcon={<Icon type="xiala" />}
                      >
                        <Option value="flow">流程</Option>
                        <Option value="screen">大屏</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name={["assetConfig", "subapp"]}>
                      <Select
                        placeholder="选择子应用"
                        size="large"
                        allowClear
                        suffixIcon={<Icon type="xiala" />}
                      >
                        <Option value="absence">请假</Option>
                        <Option value="police">警务</Option>
                      </Select>
                    </Form.Item>
                  </>
                )
              }
            </Form.Item>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});

export default MenuSetupFormComponent;
