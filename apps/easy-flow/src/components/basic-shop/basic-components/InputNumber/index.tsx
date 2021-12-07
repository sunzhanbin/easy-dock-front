import { memo, useMemo } from 'react';
import BaseInputNumber from './base-input-number';
import { InputNumberProps } from 'antd/lib/input-number';
import EventHoc from '@/components/form-engine/eventHoc';
import { useContainerContext } from '@/components/form-engine/context';
import { getCalculateNum } from './utils';

const InputNumberContainer = (props: InputNumberProps & { [key: string]: any }) => {
  const { form, rules, refresh } = useContainerContext();
  const { onChange } = props;
  const propList = useMemo(() => {
    const prop = { ...props };
    setTimeout(() => {
      if (form && rules && refresh !== undefined) {
        const formValue = form.getFieldsValue();
        const numberValue = getCalculateNum(rules, formValue, props.decimal);
        if (numberValue !== undefined && numberValue !== null) {
          prop.value = numberValue;
        }
        onChange && onChange(numberValue!);
      }
    }, 0);

    return prop;
  }, [form, props, refresh, rules]);

  return (
    <EventHoc>
      <BaseInputNumber {...propList} />
    </EventHoc>
  );
};

export default memo(InputNumberContainer);
