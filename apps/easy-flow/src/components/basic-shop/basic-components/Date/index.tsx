import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker';
import moment, { Moment } from 'moment';

const Date = (props: DatePickerProps & { readOnly: boolean; notSelectPassed: boolean }) => {
  const { format, notSelectPassed, defaultValue, readOnly, onChange } = props;
  const location = useLocation();
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | Function | Moment } = {
      size: 'large',
      disabled: readOnly as boolean,
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
  }, [format, notSelectPassed, defaultValue, readOnly, location]);
  return <DatePicker {...propList} style={{ width: '100%' }} onChange={onChange} />;
};
export default memo(Date);
