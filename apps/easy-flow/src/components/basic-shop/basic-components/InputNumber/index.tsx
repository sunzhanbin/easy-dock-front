import { memo, useEffect, useState } from 'react';
import BaseInputNumber from './base-input-number';
import { InputNumberProps } from 'antd/lib/input-number';
import EventHoc from '@/components/form-engine/eventHoc';
import { useContainerContext } from '@/components/form-engine/context';
import { getCalculateNum } from './utils';
import PubSub from 'pubsub-js';

const InputNumberComponent = (props: InputNumberProps & { unique: boolean } & { [key: string]: any }) => {
  const { form, rules, type, fieldName, changeType } = useContainerContext();
  const [value, setValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!form || !rules) return;
    console.log(props, 'rules---------number');
    const formValue = form.getFieldsValue();
    const rule = rules?.find((rule) => rule?.condition?.calcType);
    if (!rule?.condition?.calcType) return;
    const {
      condition: { calcType },
      watch,
    } = rule;
    if (!watch.includes(changeType)) return;
    const inputValue = getCalculateNum(calcType, watch, formValue, changeType);
    setValue(inputValue);
    form.setFieldsValue({ [fieldName]: inputValue });
    // console.log(`${fieldName}-change`, inputValue, formValue)
    // setTimeout(() => {
    //   PubSub.publish(`${fieldName}-change`, inputValue);
    // }, 0)
  }, [props.onChange]);

  return (
    <EventHoc>
      <BaseInputNumber {...props} value={value} />
    </EventHoc>
  );
};

export default memo(InputNumberComponent);
