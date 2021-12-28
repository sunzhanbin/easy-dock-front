import { memo, useMemo } from "react";
import { Form, Input, Select } from "antd";
import { HomeSubAppType, SubAppInfo, urlRule } from "@/consts";
import { NameMap } from "@utils/const";
import { Icon } from "@common/components";
import { useFetchDeployedSubAppListQuery } from "@/http";
import { useParams } from "react-router-dom";
import { FormInstance } from "antd/es";
import { setMenuForm } from "@views/app-setup/menu-setup.slice";
import { useAppDispatch } from "@/store";

type AssetConfigProps = {
  form: FormInstance<any>;
};

const { Option } = Select;

const MenuSetupFormAssetConfigComponent = ({ form }: AssetConfigProps) => {
  const dispatch = useAppDispatch();
  const { workspaceId } = useParams();
  const appId = useMemo(() => Number(workspaceId), [workspaceId]);
  const { subAppList } = useFetchDeployedSubAppListQuery(appId, {
    selectFromResult: ({ data }) => {
      return {
        subAppList: data?.concat({
          name: "任务中心",
          type: HomeSubAppType.TASK_CENTER,
          id: workspaceId,
        }),
      };
    },
  });
  const onSelect = (v: any) => {
    console.log(v, "v");
    const subAppItem = subAppList.find((item: { id: number }) => item.id === v);
    const subAppType = subAppItem?.type;
    if (subAppType) {
      const { assetConfig } = form.getFieldsValue();
      const config = Object.assign({}, assetConfig, { subAppType });
      console.log(config, "0000");
      form.setFieldsValue({ assetConfig: config });
    }
    const formValues = form.getFieldsValue();
    dispatch(setMenuForm(formValues));
  };

  return (
    <>
      {form.getFieldValue("asset") === "custom" ? (
        <Form.Item name={["assetConfig", "url"]} rules={[urlRule]}>
          <Input size="large" placeholder="请输入URL" />
        </Form.Item>
      ) : (
        <Form.Item name={["assetConfig", "subAppId"]}>
          <Select
            placeholder="选择子应用"
            size="large"
            onChange={onSelect}
            suffixIcon={<Icon type="xiala" />}
          >
            {(subAppList || []).map((v: SubAppInfo) => (
              <Option key={v.id} value={v.id} className="sub-app-option">
                <>
                  <span className="sub-app-type">{NameMap[v.type]}</span>
                  <span className="sub-app-name">{v.name}</span>
                </>
              </Option>
            ))}
          </Select>
        </Form.Item>
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
