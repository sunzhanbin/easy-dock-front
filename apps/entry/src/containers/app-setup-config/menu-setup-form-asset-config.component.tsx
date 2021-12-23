import { memo, useMemo } from "react";
import { Form, Input, Select } from "antd";
import { SubAppInfo, SubAppType, urlRule } from "@/consts";
import { ImageMap } from "@utils/const";
import { Icon } from "@common/components";
import { useFetchDeployedSubAppListQuery } from "@/http";
import { useParams } from "react-router-dom";

type SubAppTypeItem = {
  type: SubAppType;
  name: string;
};

type AssetConfigProps = {
  form: any;
};

const { Option } = Select;

const MenuSetupFormAssetConfigComponent = ({ form }: AssetConfigProps) => {
  const { workspaceId } = useParams();
  const appId = useMemo(() => Number(workspaceId), [workspaceId]);
  const { data: subAppList } = useFetchDeployedSubAppListQuery(appId);
  const subAppType = form.getFieldValue(["assetConfig", "subAppType"]);

  const subAppTypeList = useMemo<SubAppTypeItem[]>(() => {
    return [
      { type: SubAppType.FORM, name: "表单" },
      { type: SubAppType.FLOW, name: "流程" },
      { type: SubAppType.CHART, name: "报表" },
      { type: SubAppType.CANVAS, name: "大屏" },
      { type: SubAppType.SPACE, name: "空间" },
    ];
  }, []);

  return (
    <>
      {form.getFieldValue("asset") === "custom" ? (
        <Form.Item name={["assetConfig", "url"]} rules={[urlRule]}>
          <Input size="large" placeholder="请输入URL" />
        </Form.Item>
      ) : (
        <>
          <Form.Item name={["assetConfig", "subAppType"]} className="app-item">
            <Select
              placeholder="选择应用"
              size="large"
              suffixIcon={<Icon type="xiala" />}
            >
              {subAppTypeList.map(({ type, name }) => (
                <Option key={type} value={type} className="sub-app-option">
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
          <Form.Item name={["assetConfig", "subAppId"]}>
            <Select
              placeholder="选择子应用"
              size="large"
              suffixIcon={<Icon type="xiala" />}
            >
              {(subAppList || [])
                .filter((v: SubAppInfo) => v.type === subAppType)
                .map((v: SubAppInfo) => (
                  <Option key={v.id} value={v.id}>
                    {v.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </>
      )}
    </>
  );
};

const AssetConfigComponent = (props: AssetConfigProps) => {
  return (
    <Form.Item name={["assetConfig"]} noStyle>
      <MenuSetupFormAssetConfigComponent {...props} />
    </Form.Item>
  );
};

export default memo(AssetConfigComponent);
