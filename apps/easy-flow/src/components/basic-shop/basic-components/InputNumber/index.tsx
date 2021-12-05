import { memo, useEffect, useState } from 'react';
import BaseInputNumber from './base-input-number';
import { InputNumberProps } from 'antd/lib/input-number';
import EventHoc from '@/components/form-engine/eventHoc';
import { useContainerContext } from '@/components/form-engine/context';
import { getCalculateNum } from './utils';

const InputNumberComponent = (props: InputNumberProps & { onChange: (v: any) => void } & { [key: string]: any }) => {
  const { form, rules, refresh } = useContainerContext();
  const [value, setValue] = useState<number | undefined>(undefined);
  useEffect(() => {
    setValue(props.value as number);
    console.log(props.value, '------------');
  }, [props]);
  useEffect(() => {
    if (!form || !rules || refresh === undefined) return;
    console.log(props, 'props');
    const formValue = form.getFieldsValue();
    const inputValue = getCalculateNum(rules, formValue);
    setValue(inputValue);
    form.setFieldsValue({ [props.id as string]: inputValue });
    const { onChange } = props;
    onChange && onChange(inputValue);
  }, [form, props, refresh, rules]);

  return (
    <EventHoc>
      <BaseInputNumber {...props} value={value} />
    </EventHoc>
  );
};

export default memo(InputNumberComponent);
