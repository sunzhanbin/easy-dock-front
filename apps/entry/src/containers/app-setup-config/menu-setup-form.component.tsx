import React, {
  memo,
  ReactNode,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";
import { Form, Input, Select, Radio } from "antd";
import { selectMenuForm, setMenuForm } from "@views/app-setup/menu-setup.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { nameRule } from "@/consts";
import "@containers/app-setup-config/menu-setup-form.style";
import AssetConfigComponent from "@containers/app-setup-config/menu-setup-form-asset-config.component";

const { Option } = Select;

const MenuSetupFormComponent = React.forwardRef<{
  validateFields: () => Promise<any>;
}>(function MenuSetupForm(_, ref) {
  const dispatch = useAppDispatch();

  const menuForm = useAppSelector(selectMenuForm);
  const [form] = Form.useForm();
  const containerRef = useRef<HTMLDivElement>(null);

  const iconList = useMemo<string[]>(() => {
    return [
      "wukongjian",
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

  const handleValuesChange = useCallback((changedValue) => {
    // 改变了子应用类型,子应用id要重置
    if (changedValue?.assetConfig?.subAppType) {
      const oldConfig = form.getFieldValue("assetConfig");
      const assetConfig = Object.assign({}, oldConfig, { subAppId: undefined });
      form.setFieldsValue({ assetConfig });
    }
    const formValues = form.getFieldsValue();
    dispatch(setMenuForm(formValues));
  }, []);

  useImperativeHandle(ref, () => ({
    validateFields: () => form.validateFields(),
  }));

  useEffect(() => {
    form.setFieldsValue(menuForm);
  }, [menuForm]);

  return (
    <div className="menu-setup-form-component" ref={containerRef}>
      <div className="header">菜单属性</div>
      <div className="form">
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onValuesChange={handleValuesChange}
        >
          <Form.Item label="菜单名称" name="name" required rules={[nameRule]}>
            <Input size="large" placeholder="请输入" />
          </Form.Item>
          <Form.Item label="菜单icon" name="icon">
            <Select
              size="large"
              placeholder="请选择"
              optionLabelProp="label"
              dropdownRender={dropdownRender}
              suffixIcon={<Icon type="xiala" />}
              getPopupContainer={() => containerRef.current!}
            >
              {iconList.map((icon) => (
                <Option
                  key={icon}
                  value={icon}
                  label={icon === "wukongjian" ? "无" : <Icon type={icon} />}
                >
                  <Icon type={icon} />
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="查看方式" name="mode">
            <Radio.Group size="large">
              <Radio value="current">当前页面打开</Radio>
              <Radio value="blank">新窗口打开</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="内容设置">
            <Form.Item name="asset" className="asset-item">
              <Radio.Group
                size="large"
                optionType="button"
                className="asset-option"
                options={options}
              />
            </Form.Item>
            <AssetConfigComponent form={form} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});

export default memo(MenuSetupFormComponent);
