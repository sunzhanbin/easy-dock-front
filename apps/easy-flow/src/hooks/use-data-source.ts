import { useState, useEffect, useCallback } from 'react';
import { runtimeAxios } from '@utils';
import { OptionItem, SelectOptionItem } from '@/type';

export type DataSourceParams = {
  prevDataSource?: SelectOptionItem;
  dataSource: SelectOptionItem | null;
  id?: string;
  selectId?: string;
  formDataList?: { name: string; value: any }[];
};

export default function useDataSource({ dataSource, prevDataSource, id, selectId, formDataList }: DataSourceParams) {
  const [data, setData] = useState<OptionItem[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const loadData = useCallback(() => {
    if (!dataSource || JSON.stringify(dataSource) === JSON.stringify(prevDataSource)) {
      return;
    }
    if (dataSource?.type === 'custom') {
      const { data = [] } = dataSource;
      setData(data);
    } else if (dataSource?.type === 'subapp') {
      const { fieldName = '', subappId = '' } = dataSource;
      if (fieldName && subappId) {
        setLoading(true);
        runtimeAxios
          .get(`/subapp/${subappId}/form/${fieldName}/data`)
          .then((res) => {
            const data = (res.data?.data || []).map((val: string) => ({ key: val, value: val }));
            setData(data);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (dataSource?.type === 'interface') {
      const { apiConfig } = dataSource;
      let list: OptionItem[] = [];
      if (apiConfig && formDataList) {
        const name = (apiConfig.response as { name: string })?.name;
        const formValues = formDataList.filter((val) => val.value);
        if (name) {
          setLoading(true);
          runtimeAxios
            .post('/common/doHttpJson', { jsonObject: apiConfig, formDataList: formValues })
            .then((res) => {
              const data = eval(`res.${name}`);
              if (Array.isArray(data)) {
                if (data.every((val) => typeof val === 'string')) {
                  // 字符串数组
                  list = data.map((val) => ({ key: val, value: val }));
                } else if (data.every((val) => val.key && val.value)) {
                  // key-value对象数组
                  list = data.map((item) => ({ key: item.key, value: item.value }));
                }
                setData(list);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }
      setData(list);
    }
  }, [dataSource, formDataList, prevDataSource]);
  useEffect(() => {
    // 当前组件改变才更新数据源
    if (id === selectId) {
      loadData();
    }
  }, [loadData, id, selectId]);
  // 初始化请求数据源
  useEffect(() => {
    loadData();
  }, []);
  return [data, loading];
}
