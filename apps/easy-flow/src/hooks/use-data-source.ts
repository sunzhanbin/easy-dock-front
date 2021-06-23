import { useState, useEffect } from 'react';
import { runtimeAxios } from '@utils';
import { OptionItem, SelectOptionItem } from '@/type';

export default function useDataSource(dataSource: SelectOptionItem) {
  const [data, setData] = useState<OptionItem[]>();
  useEffect(() => {
    if (dataSource?.type === 'custom') {
      const { data = [] } = dataSource;
      setData(data);
    } else if (dataSource?.type === 'subapp') {
      const { fieldName = '', subappId = '' } = dataSource;
      if (fieldName && subappId) {
        runtimeAxios.get(`/subapp/${subappId}/form/${fieldName}/data`).then((res) => {
          const data = (res.data?.data || []).map((val: string) => ({ key: val, value: val }));
          setData(data);
        });
      }
    }
  }, [dataSource?.type, dataSource?.fieldName, dataSource?.subappId, dataSource?.data]);
  return data;
}
