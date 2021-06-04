import React, { memo, useMemo } from 'react';
import { DatePicker } from 'antd';
import { DateField } from '@/type';
import moment, { Moment } from 'moment';

const Date = (props: DateField) => {
  const { format, notSelectPassed, defaultValue, readonly } = props;
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | Function | Moment } = {
      size: 'large',
      disabled: readonly as boolean,
    };
    let formatStr: string = '';
    if (format === '2') {
      props.showTime = true;
      formatStr = 'YYYY-MM-DD HH:mm:ss';
    } else if (format === '1') {
      formatStr = 'YYYY-MM-DD';
    }
    props.format = formatStr;
    if (notSelectPassed) {
      props.disabledDate = (current: Moment) => {
        return current && current < moment().endOf('second');
      };
    }
    if (defaultValue) {
      const value = moment(defaultValue, formatStr);
      props.value = value;
      props.defaultValue = value;
    }
    return props;
  }, [format, notSelectPassed, defaultValue, readonly]);
  return <DatePicker {...propList} />;
};
export default memo(Date);
