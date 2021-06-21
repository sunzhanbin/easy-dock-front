import { memo, useEffect, useMemo, useState } from 'react';
import { Checkbox } from 'antd';
import { SelectOptionItem } from '@/type';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { runtimeAxios } from '@/utils';

const CheckboxComponent = (props: CheckboxGroupProps & { readOnly: boolean; dataSource: SelectOptionItem }) => {
  const { dataSource, readOnly, onChange } = props;
  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    if (dataSource?.type === 'custom') {
      const list = (dataSource?.data || []).map((item) => item.value);
      setOptions(list);
    } else if (dataSource?.type === 'subapp') {
      const { fieldName, subappId } = dataSource || {};
      if (fieldName && subappId) {
        runtimeAxios.get(`/subapp/${subappId}/form/${fieldName}/data`).then((res) => {
          const list = res.data?.data || [];
          setOptions(list);
        });
      }
    }
  }, [dataSource]);
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean | string[] | Function } = {
      disabled: readOnly,
      options: options,
      onChange: onChange as Function,
    };
    return Object.assign({}, props, prop);
  }, [options, readOnly, props, onChange]);
  return <Checkbox.Group {...propList}></Checkbox.Group>;
};

export default memo(CheckboxComponent);
