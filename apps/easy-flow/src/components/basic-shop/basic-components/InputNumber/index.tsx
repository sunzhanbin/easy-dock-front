import {memo, useEffect, useState} from 'react';
import BaseInputNumber from './base-input-number';
import {InputNumberProps} from 'antd/lib/input-number';
import EventHoc from '@/components/form-engine/eventHoc';
import {useContainerContext} from '@/components/form-engine/context';

const InputNumberComponent = (props: InputNumberProps & { unique: boolean } & { [key: string]: any }) => {
  const {form, rules, fieldName, type} = useContainerContext();

  const [value, setValue] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!form) return;
    const formValue = form.getFieldsValue();
    rules.map(rule => {
      if (!rule?.condition?.calcType) return
      const {calcType} = rule?.condition
    })
    console.log({formValue, rules, fieldName, type});
  });

  return (
    <EventHoc>
      <BaseInputNumber {...props} value={value}/>
    </EventHoc>
  );
};

export default memo(InputNumberComponent);
