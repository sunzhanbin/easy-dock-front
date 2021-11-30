import { useCallback } from "react";
import { Form, Input, Select, Checkbox, Button, Radio } from "antd";

import "./menu-setup-form.style";

const { Option } = Select;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const MenuSetupFormComponent = () => {
  const [form] = Form.useForm();

  const handleFormFinish = useCallback((values: { [key: string]: any }) => {
    console.log("values", values);
  }, []);

  return (
    <div className="menu-setup-form-component">
      <div className="header">内容设置</div>
      <div className="form">
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item
            label="菜单名称"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="showMenu" valuePropName="checked">
            <Checkbox>显示菜单 icon</Checkbox>
          </Form.Item>
          <Form.Item
            name="icon"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Select placeholder="选择菜单 icon" allowClear>
              <Option value="icon1">菜单icon1</Option>
              <Option value="icon2">菜单icon2</Option>
              <Option value="icon3">菜单icon3</Option>
            </Select>
          </Form.Item>
          <Form.Item label="查看方式" name="mode">
            <Radio.Group>
              <Radio value={0}>当前页面打开</Radio>
              <Radio value={1}>新窗口打开</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="isHome" valuePropName="checked">
            <Checkbox>设置为主页</Checkbox>
          </Form.Item>
          <Form.Item label="内容设置">
            <Form.Item name="asset">
              <Radio.Group size="small">
                <Radio.Button value="exist">使用已有资产</Radio.Button>
                <Radio.Button value="custom">自定义 URL</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev, current) => prev.asset !== current.asset}
            >
              {({ getFieldValue }) =>
                getFieldValue("asset") === "custom" ? (
                  <Form.Item name={["assetConfig", "url"]}>
                    <Input placeholder="请输入URL" />
                  </Form.Item>
                ) : (
                  <>
                    <Form.Item name={["assetConfig", "app"]}>
                      <Select placeholder="选择应用" allowClear>
                        <Option value="flow">流程</Option>
                        <Option value="screen">大屏</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name={["assetConfig", "subapp"]}>
                      <Select placeholder="选择子应用" allowClear>
                        <Option value="absence">请假</Option>
                        <Option value="police">警务</Option>
                      </Select>
                    </Form.Item>
                  </>
                )
              }
            </Form.Item>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default MenuSetupFormComponent;
