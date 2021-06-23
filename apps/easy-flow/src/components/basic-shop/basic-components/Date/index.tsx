import { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker';
import moment, { Moment } from 'moment';
import { useRouteMatch } from 'react-router-dom';

const Date = (props: DatePickerProps & { readOnly: boolean; notSelectPassed: boolean }) => {
  const { format, notSelectPassed, defaultValue, readOnly, value, onChange } = props;
  const location = useLocation();
  const match = useRouteMatch();
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean | Function | Moment } = {
      size: 'large',
      disabled: readOnly as boolean,
      onChange: onChange as Function,
    };
    let formatStr: string = '';
    if (format === '2') {
      prop.showTime = true;
      formatStr = 'YYYY-MM-DD HH:mm:ss';
    } else if (format === '1') {
      formatStr = 'YYYY-MM-DD';
    }
    prop.format = formatStr;
    if (notSelectPassed) {
      prop.disabledDate = (current: Moment) => {
        return current && current < moment().endOf('second');
      };
    }
    if (defaultValue) {
      const value = moment(defaultValue, formatStr);
      prop.defaultValue = value;
      if (location.pathname === `${match.url}`) {
        prop.value = value;
      }
    }
    if (value) {
      if (typeof value === 'number') {
        prop.value = moment(value);
      } else if ((value as any)._isAMomentObject) {
        prop.value = value;
      }
    }
    return Object.assign({}, props, prop);
  }, [format, notSelectPassed, defaultValue, readOnly, location, props, match, onChange]);
  return <DatePicker {...propList} style={{ width: '100%' }} />;
};
export default memo(Date);
