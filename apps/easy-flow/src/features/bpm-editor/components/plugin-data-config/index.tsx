import { memo, FC, useMemo } from "react";
import classNames from "classnames";
import { Form, Input } from "antd";
import { PluginDataConfig as IPluginDataConfig } from "@/type/flow";
import PluginHttpParams from "../plugin-http-params";
import styles from "./index.module.scss";

export interface PluginDataConfigProps {
  name: string;
  value?: IPluginDataConfig;
  onChange?: (val: this["value"]) => void;
}

function formatArray(arr: Array<any> | null | undefined) {
  if (arr === null || arr === undefined) {
    return [];
  }
  return arr;
}

const PluginDataConfig: FC<PluginDataConfigProps> = ({ name, value }) => {
  const showRequestParams = useMemo<boolean>(() => {
    if (!value) {
      return false;
    }
    const { meta } = value;
    const { headers, bodys, querys, paths } = meta;
    const requestParams = [
      ...formatArray(headers),
      ...formatArray(bodys),
      ...formatArray(querys),
      ...formatArray(paths),
    ];
    if (!requestParams.length) {
      return false;
    }
    return true;
  }, [value]);
  const bottom = useMemo(() => {
    if (showRequestParams || value?.meta.responses?.length) {
      return "24px";
    }
    return "0px";
  }, [showRequestParams, value]);
  return (
    <Form.Item noStyle shouldUpdate>
      <Form.Item name={[name, "type"]} hidden={true}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={[name, "code"]} hidden={true}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={[name, "name"]} label="插件名称" className={styles.title} style={{ marginBottom: bottom }}>
        <Input size="large" placeholder="请输入插件名称" disabled />
      </Form.Item>
      <Form.Item name={[name, "meta", "url"]} label="请求方法" hidden={true}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={[name, "meta", "method"]} hidden={true}>
        <Input disabled />
      </Form.Item>
      {showRequestParams && (
        <Form.Item label="推送参数配置" className={classNames(styles.mb8, styles.title)}>
          {value?.meta?.headers?.length ? <PluginHttpParams name={[name, "meta", "headers"]} label="请求头" /> : null}
          {value?.meta?.bodys?.length ? <PluginHttpParams name={[name, "meta", "bodys"]} label="请求体" /> : null}
          {value?.meta?.querys?.length ? <PluginHttpParams name={[name, "meta", "querys"]} label="QUERY" /> : null}
          {value?.meta?.paths?.length ? <PluginHttpParams name={[name, "meta", "paths"]} label="路径" /> : null}
        </Form.Item>
      )}
      {value?.meta.responses?.length ? (
        <Form.Item
          label="返回参数配置"
          name={[name, "meta", "responses"]}
          className={styles.title}
          style={{ marginBottom: "0" }}
        >
          <PluginHttpParams name={[name, "meta", "responses"]} text="更新" />
        </Form.Item>
      ) : null}
    </Form.Item>
  );
};

export default memo(PluginDataConfig);
