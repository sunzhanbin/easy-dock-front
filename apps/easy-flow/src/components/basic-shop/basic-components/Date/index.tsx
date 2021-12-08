import { memo, useMemo } from 'react';
import BaseDate from './base-date';
import EventHoc from '@components/form-engine/eventHoc';
import { DatePickerProps } from 'antd/lib/date-picker';
import { useContainerContext } from '@components/form-engine/context';
import getDisabledDateRule from './utils';
import { Moment } from 'moment';

const Date = (props: DatePickerProps & { onChange: (v: any) => void } & { [key: string]: any }) => {
  const { form, rules } = useContainerContext();

  const handleDisabledDate = useMemo(() => {
    return (current: Moment) => {
      const formValue = form.getFieldsValue();
      return getDisabledDateRule({
        rules,
        current,
        formValue,
        id: props.id!,
        range: props.datelimit?.enable ? props.datelimit?.daterange : undefined,
        format: props.format,
      });
    };
  }, [rules, form, props.id, props.datelimit, props.format]);

  return (
    <EventHoc>
      <BaseDate {...props} disabledDate={handleDisabledDate} />
    </EventHoc>
  );
};

export default memo(Date);
