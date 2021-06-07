import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { DatePicker } from 'antd';
import { DateField } from '@/type';
import moment, { Moment } from 'moment';

const Date = (props: DateField) => {
  const { format, notSelectPassed, defaultValue, readonly } = props;
  const location = useLocation();
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
      props.defaultValue = value;
      if (location.pathname === '/form-design') {
        props.value = value;
      }
    }
    return props;
  }, [format, notSelectPassed, defaultValue, readonly, location]);
  return <DatePicker {...propList} style={{ width: '100%' }} />;
};
export default memo(Date);
