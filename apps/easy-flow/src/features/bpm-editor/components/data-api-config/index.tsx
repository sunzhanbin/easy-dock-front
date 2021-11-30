import { memo, useEffect, useState, useMemo, useRef, ReactNode } from 'react';
import classNames from 'classnames';
import { Select, Form, Input, Radio, RadioChangeEvent } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Api, ParamType, DataConfig, ApiType } from '@type/api';
import { Icon, Loading } from '@common/components';
import { ParamReturn, queryApiDetail, queryApis } from './util';
import DataContext from './context';
import Required from './required';
import Custom from './custom';
import styles from './index.module.scss';

export interface DataApiConfigProps {
  value?: DataConfig;
  onChange?(val: this['value']): void;
  layout?: 'vertical' | 'horizontal';
  fields: { name: string; id: string }[];
  name: string | string[];
  children?: ReactNode;
  className?: string;
  maxWidth?: string;
  label: string;
}

const defaultValue: DataConfig = {
  type: 1,
  request: {
    required: [],
    customize: [],
  },
};

function DataApiConfig(props: DataApiConfigProps) {
  const {
    value = defaultValue,
    onChange,
    layout = 'vertical',
    fields,
    name,
    children,
    label,
    className,
    maxWidth,
  } = props;
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(false);
  const [customConfig, setCustomConfig] = useState<DataConfig | undefined>(value);
  const [orchConfig, setOrchConfig] = useState<DataConfig | undefined>(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadApiDetailFromApiSelector = useRef(false);
  const [apiDetail, setApiDetail] = useState<{
    requireds: ParamReturn[];
    optionals: ParamReturn[];
    responses: ParamReturn[];
  }>();
  const loadApiDetail = useMemoCallback(async (api: number) => {
    try {
      setLoading(true);

      const [requireds, optionals, responses] = await queryApiDetail(api, true);

      setApiDetail({ requireds, optionals, responses });

      return [requireds, optionals, responses];
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    queryApis().then((apis) => setApis(apis));
  }, []);

  useEffect(() => {
    (async () => {
      if (!value?.id || loadApiDetailFromApiSelector.current) return;

      loadApiDetail(value.id);
    })();
  }, [value?.id, loadApiDetail]);

  // 缓存接口配置,切换方式时方便回显
  useEffect(() => {
    if (value?.type === ApiType.ORCH_SERVICE) {
      setOrchConfig(value);
    } else if (value?.type === ApiType.CUSTOM) {
      setCustomConfig(value);
    }
  }, [value, setCustomConfig, setOrchConfig]);

  const handleApiChange = useMemoCallback(async (id: number) => {
    loadApiDetailFromApiSelector.current = true;

    const [requireds] = await loadApiDetail(id);

    const requireParams = requireds.map((item) => ({
      name: item.name,
      type: ParamType.Required,
      location: item.from,
    }));

    if (onChange) {
      onChange({
        type: value!.type,
        id,
        request: {
          required: requireParams,
          customize: [],
        },
        response: undefined,
      });
    }
  });

  const thisFormItemName = useMemo(() => {
    return ([] as string[]).concat(name);
  }, [name]);

  const getPopupContainer = useMemo(() => {
    return () => containerRef.current!;
  }, []);

  const excludeDescField = useMemo(() => {
    return fields.filter((field) => field.id);
  }, [fields]);

  const typeOptions = useMemo(() => {
    return [
      { label: '选择已有接口', value: 1 },
      { label: '自定义接口', value: 2 },
    ];
  }, []);

  const handleChangeType = useMemoCallback((e: RadioChangeEvent) => {
    const value = e.target.value;
    if (onChange) {
      if (value === ApiType.ORCH_SERVICE) {
        onChange({
          type: value,
          id: orchConfig?.id,
          request: orchConfig?.request || { required: [], customize: [] },
          response: orchConfig?.response,
        });
      } else if (value === ApiType.CUSTOM) {
        onChange({
          type: value,
          url: customConfig?.url,
          method: customConfig?.method,
          request: customConfig?.request || { required: [], customize: [] },
          response: customConfig?.response,
        });
      }
    }
  });

  const urlRule = useMemo(() => {
    return {
      validator(_: any, val: string) {
        if (!val) {
          return Promise.reject(new Error('请输入接口地址'));
        }
        // eslint-disable-next-line
        const urlRegex = /(^(http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/;
        if (!urlRegex.test(val)) {
          return Promise.reject(new Error('请输入正确的接口地址'));
        }
        return Promise.resolve();
      },
    };
  }, []);

  return (
    <DataContext.Provider
      value={{ name: thisFormItemName, fields: excludeDescField, detail: apiDetail, layout, getPopupContainer }}
    >
      <div className={classNames(styles.container, className)} ref={containerRef}>
        {loading && <Loading className={styles.loading} />}
        <Form.Item name={[...thisFormItemName, 'type']} initialValue={value?.type}>
          <Radio.Group
            optionType="button"
            size="large"
            options={typeOptions}
            className={styles.type}
            style={{ maxWidth: maxWidth ? maxWidth : '100%' }}
            onChange={handleChangeType}
          ></Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={true}>
          {(form) => {
            const type = form.getFieldValue([...thisFormItemName, 'type']);
            if (type === 1) {
              return (
                <>
                  <Form.Item
                    name={[...thisFormItemName, 'id']}
                    className={styles['api-form-item']}
                    rules={[
                      {
                        validator(_, val) {
                          if (!val) {
                            return Promise.reject(new Error('请选择数据接口'));
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Select
                      onChange={handleApiChange}
                      showSearch
                      value={value?.id}
                      size="large"
                      className={styles.apis}
                      filterOption={(ipt, option) => option!.title.indexOf(ipt) > -1}
                      placeholder="请选择"
                      getPopupContainer={getPopupContainer}
                    >
                      {apis.map((api) => (
                        <Select.Option title={api.name} value={api.id} key={api.id}>
                          {api.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className={styles.subtitle}>{label}</div>

                  {/* 必填参数 */}
                  <Required key={value?.id} name={[...thisFormItemName, 'request', 'required']} />
                </>
              );
            }
            if (type === 2) {
              return (
                <>
                  <Form.Item
                    name={[...thisFormItemName, 'url']}
                    label="接口地址"
                    rules={[urlRule]}
                    labelCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input size="large" placeholder="请输入接口地址" />
                  </Form.Item>
                  <Form.Item
                    name={[...thisFormItemName, 'method']}
                    label="请求方式"
                    rules={[
                      {
                        validator(_, val) {
                          if (!val) {
                            return Promise.reject(new Error('请选择请求方式'));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    labelCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Select size="large" placeholder="请选择" suffixIcon={<Icon type="xiala" />}>
                      <Select.Option value="POST">POST</Select.Option>
                      <Select.Option value="GET">GET</Select.Option>
                      <Select.Option value="PUT">PUT</Select.Option>
                      <Select.Option value="DELETE">DELETE</Select.Option>
                    </Select>
                  </Form.Item>
                  <div className={styles.subtitle}>{label}</div>
                </>
              );
            }
            return null;
          }}
        </Form.Item>
        {/* 自定义参数包括可选参数 */}
        <Custom name={[...thisFormItemName, 'request', 'customize']} />

        {/* 响应参数 */}
        {children}
      </div>
    </DataContext.Provider>
  );
}

export default memo(DataApiConfig);
