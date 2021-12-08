import { useMemo, ReactNode } from 'react';
import { rangeItem } from '@type';
import { Select, message } from 'antd';
import { Icon } from '@common/components';
import { useAppSelector } from '@app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
const { Option } = Select;
const DateFormat = (props: any) => {
  const { id, value, onChange, placeholder } = props;
  const byId = useAppSelector(componentPropsSelector);
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | Function | ReactNode } = {
      size: 'large',
      placeholder: placeholder || '请选择',
      suffixIcon: <Icon type="xiala" />,
    };
    props.value = value;
    return props;
  }, [value, placeholder]);
  const handleChange = (val: string) => {
    // XXX控件的计算结果依赖该控件，请检查相关控件并修改
    const labelStr: string[] = [];
    Object.values(byId).forEach((item) => {
      if (item.type === 'InputNumber' && item.defaultNumber && item.defaultNumber?.calculateData?.includes(id)) {
        const { label } = item;
        labelStr.push(label);
      }
    });
    if (labelStr.length) {
      message.warning(`"${labelStr.join('，')}"控件的计算结果依赖该控件，请检查相关控件并修改`);
    }
    onChange && onChange(val);
  };
  return (
    <Select {...propList} onChange={handleChange}>
      {props.range &&
        (props.range as rangeItem[]).map((v) => (
          <Option value={v.key} key={v.key}>
            {v.value}
          </Option>
        ))}
    </Select>
  );
};

export default DateFormat;
