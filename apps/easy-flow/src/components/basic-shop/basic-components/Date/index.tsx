import { memo, useEffect, useMemo, useState } from 'react';
import BaseDate from './base-date';
import EventHoc from '@components/form-engine/eventHoc';
import { DatePickerProps } from 'antd/lib/date-picker';
import { useContainerContext } from '@components/form-engine/context';
import getDisabledDateRule from './utils';
import moment from 'moment';
import useMemoCallback from '@common/hooks/use-memo-callback';

const Date = (props: DatePickerProps & { onChange: (v: any) => void } & { [key: string]: any }) => {
  const { form, rules, refresh } = useContainerContext();
  // const [disabledDate, setDisabledDate] = useState<boolean>(false);

  // useEffect(() => {
  //   if (!form || !rules) return;
  //   const formValue = form.getFieldsValue();
  //
  //   const disabledDate = props?.value && props.value < moment().endOf('day');
  //   // const disabledDate = getDisabledDateRule({ rules, formValue });
  //   // disabledDate && setDisabledDate(disabledDate)
  //   console.log(props, 'rules');
  // }, [form, props, rules]);
  // const handleDisabledDate = useMemoCallback((current) => {
  //   console.log(rules, 'rules');
  //   return current && current < moment().endOf('day');
  // });

  const handleDisabledDate = useMemo(() => {
    // return current && current < moment().endOf('day'); 
    return () => {
      console.info({ rules })
      return false
    };
  }, [rules])


  return (
    <EventHoc>
      <BaseDate {...props} disabledDate={handleDisabledDate} />
    </EventHoc>
  );
};

export default memo(Date);
