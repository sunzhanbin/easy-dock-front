import { memo, FC } from "react";
import { Form, Input } from "antd";
import { PluginDataConfig as IPluginDataConfig } from "@/type/flow";
import PluginHttpParams from "../plugin-http-params";
import styles from "./index.module.scss";

export interface PluginDataConfigProps {
  name: string;
  value?: IPluginDataConfig;
  onChange?: (val: this["value"]) => void;
}

const PluginDataConfig: FC<PluginDataConfigProps> = ({ name, value, onChange }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      <Form.Item name={[name, "type"]} hidden={true}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={[name, "code"]} hidden={true}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={[name, "name"]} label="插件名称">
        <Input size="large" placeholder="请输入插件名称" disabled />
      </Form.Item>
      <Form.Item name={[name, "meta", "url"]} label="请求方法" hidden={true}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={[name, "meta", "method"]} hidden={true}>
        <Input disabled />
      </Form.Item>
      <Form.Item label="推送参数配置" className={styles.mb8}>
        {value?.meta?.headers?.length ? <PluginHttpParams name={[name, "meta", "headers"]} label="请求头" /> : null}
        {value?.meta?.bodys?.length ? <PluginHttpParams name={[name, "meta", "bodys"]} label="请求体" /> : null}
        {value?.meta?.querys?.length ? <PluginHttpParams name={[name, "meta", "querys"]} label="QUERY" /> : null}
        {value?.meta?.paths?.length ? <PluginHttpParams name={[name, "meta", "paths"]} label="路径" /> : null}
      </Form.Item>
      {value?.meta.responses.length ? (
        <Form.Item label="返回参数配置" name={[name, "meta", "responses"]}>
          <PluginHttpParams name={[name, "meta", "responses"]} text="更新" />
        </Form.Item>
      ) : null}
    </Form.Item>
  );
};

export default memo(PluginDataConfig);
