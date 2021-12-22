import React, {
  ReactNode,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";
import { Form, Input, Select, Radio } from "antd";
import { useParams } from "react-router-dom";
import { selectMenuForm, setMenuForm } from "@views/app-setup/menu-setup.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { nameRule, SubAppInfo, SubAppType, urlRule } from "@/consts";
import { useFetchDeployedSubAppListQuery } from "@/http";
import "@containers/app-setup-config/menu-setup-form.style";
import { ImageMap } from "@utils/const";

const { Option } = Select;
type SubAppTypeItem = {
  type: SubAppType;
  name: string;
};

const MenuSetupFormComponent = React.forwardRef<{
  validateFields: () => Promise<any>;
}>(function menuSetupForm(_, ref) {
  const dispatch = useAppDispatch();
  const { workspaceId } = useParams();
  const appId = useMemo(() => Number(workspaceId), [workspaceId]);
  const { data: subAppList } = useFetchDeployedSubAppListQuery(appId);
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

  const subAppTypeList = useMemo<SubAppTypeItem[]>(() => {
    return [
      { type: SubAppType.FORM, name: "表单" },
      { type: SubAppType.FLOW, name: "流程" },
      { type: SubAppType.CHART, name: "报表" },
      { type: SubAppType.CANVAS, name: "大屏" },
      { type: SubAppType.SPACE, name: "空间" },
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
            <Form.Item
              noStyle
              shouldUpdate={(prev, current) => prev.asset !== current.asset}
            >
              {({ getFieldValue }) =>
                getFieldValue("asset") === "custom" ? (
                  <Form.Item name={["assetConfig", "url"]} rules={[urlRule]}>
                    <Input size="large" placeholder="请输入URL" />
                  </Form.Item>
                ) : (
                  <>
                    <Form.Item
                      name={["assetConfig", "subAppType"]}
                      className="app-item"
                    >
                      <Select
                        placeholder="选择应用"
                        size="large"
                        suffixIcon={<Icon type="xiala" />}
                      >
                        {subAppTypeList.map(({ type, name }) => (
                          <Option
                            key={type}
                            value={type}
                            className="sub-app-option"
                          >
                            <img
                              className="sub-app-icon"
                              src={ImageMap[type]}
                              alt="logo"
                            />
                            <span>{name}</span>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, current) =>
                        prev.assetConfig?.subAppType !==
                        current.assetConfig?.subAppType
                      }
                    >
                      {({ getFieldValue }) => {
                        const subAppType = getFieldValue([
                          "assetConfig",
                          "subAppType",
                        ]);
                        return (
                          <Form.Item name={["assetConfig", "subAppId"]}>
                            <Select
                              placeholder="选择子应用"
                              size="large"
                              suffixIcon={<Icon type="xiala" />}
                            >
                              {(subAppList || [])
                                .filter(
                                  (v: SubAppInfo) => v.type === subAppType
                                )
                                .map((v: SubAppInfo) => (
                                  <Option key={v.id} value={v.id}>
                                    {v.name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        );
                      }}
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
