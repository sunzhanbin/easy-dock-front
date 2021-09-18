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

export default function useDataSource({ dataSource, prevDataSource }: DataSourceParams) {
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
      // const { apiconfig } = dataSource;
      // let list: OptionItem[] = [];
      // if (apiconfig && formDataList) {
      //   const name = (apiconfig.response as { name: string })?.name;
      //   const formValues = formDataList.filter((val) => val.value);
      //   if (name) {
      //     setLoading(true);
      //     runtimeAxios
      //       .post('/common/doHttpJson', { jsonObject: apiconfig, formDataList: formValues })
      //       .then((res) => {
      //         const data = eval(`res.${name}`);
      //         if (Array.isArray(data)) {
      //           if (data.every((val) => typeof val === 'string')) {
      //             // 字符串数组
      //             list = data.map((val) => ({ key: val, value: val }));
      //           } else if (data.every((val) => val.key && val.value)) {
      //             // key-value对象数组
      //             list = data.map((item) => ({ key: item.key, value: item.value }));
      //           }
      //           setData(list);
      //         }
      //       })
      //       .finally(() => {
      //         setLoading(false);
      //       });
      //   }
      // }
      // setData(list);
      setData([]);
    }
  }, [dataSource, prevDataSource]);
  useEffect(() => {
    loadData();
  }, [loadData]);
  return [data, loading];
}
