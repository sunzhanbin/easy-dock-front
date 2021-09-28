import { memo, useEffect, useState, useMemo, useRef, ReactNode } from 'react';
import { Select, Form } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Api, ParamType, DataConfig } from '@type/api';
import { Loading } from '@common/components';
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
  label: string;
}

function DataApiConfig(props: DataApiConfigProps) {
  const { value, onChange, layout = 'vertical', fields, name, children, label } = props;
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(false);
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
      if (!value?.api || loadApiDetailFromApiSelector.current) return;

      loadApiDetail(value.api);
    })();
  }, [value?.api, loadApiDetail]);

  const handleApiChange = useMemoCallback(async (api: number) => {
    loadApiDetailFromApiSelector.current = true;

    const [requireds] = await loadApiDetail(api);

    if (onChange) {
      onChange({
        api,
        request: {
          required: requireds.map((item) => ({
            name: item.name,
            type: ParamType.Required,
            location: item.from,
          })),
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

  return (
    <DataContext.Provider
      value={{ name: thisFormItemName, fields: excludeDescField, detail: apiDetail, layout, getPopupContainer }}
    >
      <div className={styles.container} ref={containerRef}>
        {loading && <Loading className={styles.loading} />}

        <Form.Item
          name={[...thisFormItemName, 'api']}
          className={styles['api-form-item']}
          rules={[
            {
              validator(_, val) {
                if (!val) {
                  return Promise.reject(new Error('不能为空'));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Select
            onChange={handleApiChange}
            showSearch
            value={value?.api}
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
        <Required key={value?.api} name={[...thisFormItemName, 'request', 'required']} />

        {/* 自定义参数包括可选参数 */}
        <Custom name={[...thisFormItemName, 'request', 'customize']} />

        {/* 响应参数 */}
        {children}
      </div>
    </DataContext.Provider>
  );
}

export default memo(DataApiConfig);
