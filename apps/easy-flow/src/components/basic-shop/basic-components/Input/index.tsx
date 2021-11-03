import { memo, useEffect } from 'react';
import BaseInput from './base-input';
import { InputProps } from 'antd/lib/input';
import EventHoc from '@/components/form-engine/eventHoc';
import { useContainerContext } from '@/components/form-engine/context';

const InputComponent = (props: InputProps & { unique: boolean } & { [key: string]: any }) => {
  const { form, rules, fieldName, type } = useContainerContext();

  useEffect(() => {
    var formValue = form.getFieldsValue();
    console.log({ formValue, rules, fieldName, type });
  });

  return (
    <EventHoc>
      <BaseInput {...props}></BaseInput>
    </EventHoc>
  );
};

export default memo(InputComponent);
