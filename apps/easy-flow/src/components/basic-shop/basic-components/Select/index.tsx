import { memo, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { Select } from 'antd';
import { OptionItem, SelectOptionItem } from '@/type';
import { SelectProps } from 'antd/lib/select';
import { runtimeAxios } from '@/utils';

const { Option } = Select;

const SelectComponent = (
  props: SelectProps<string> & { readOnly: boolean; multiple: boolean; dataSource: SelectOptionItem },
) => {
  const { defaultValue, multiple, showSearch, dataSource, readOnly, onChange } = props;
  const location = useLocation();
  const [options, setOptions] = useState<OptionItem[]>([]);
  useEffect(() => {
    if (dataSource?.type === 'custom') {
      const list = dataSource?.data || [];
      setOptions(list);
    } else if (dataSource?.type === 'subapp') {
      const { fieldName, subappId } = dataSource || {};
      if (fieldName && subappId) {
        runtimeAxios.get(`/subapp/${subappId}/form/${fieldName}/data`).then((res) => {
          const list = (res.data?.data || []).map((item: string) => ({ key: item, value: item }));
          setOptions(list);
        });
      }
    }
  }, [dataSource]);
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean | Function } = {
      size: 'large',
      showSearch: showSearch as boolean,
      placeholder: '请选择',
      disabled: readOnly as boolean,
      onChange: onChange as Function,
    };
    if (multiple) {
      prop.mode = 'multiple';
    }
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
      if (location.pathname === '/form-design') {
        prop.value = defaultValue as string;
      }
    }
    return Object.assign({}, props, prop);
  }, [defaultValue, multiple, showSearch, readOnly, location, props, onChange]);
  return (
    <Select {...propList} style={{ width: '100%' }}>
      {options.map(({ key, value }) => (
        <Option value={key} key={key}>
          {value}
        </Option>
      ))}
    </Select>
  );
};

export default memo(SelectComponent);
