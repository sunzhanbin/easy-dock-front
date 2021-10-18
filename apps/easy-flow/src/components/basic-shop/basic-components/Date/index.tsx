import { memo, ReactNode, useMemo } from 'react';
import { DatePicker } from 'antd';
import { Icon } from '@common/components';
import { DatePickerProps } from 'antd/lib/date-picker';
import moment, { Moment } from 'moment';

const Date = (props: DatePickerProps & { notSelectPassed: boolean; onChange: (value?: number) => void }) => {
  const {format, notSelectPassed, defaultValue, value, onChange, disabledDate} = props;
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean | Function | Moment | ReactNode } = {
      size: 'large',
      suffixIcon: <Icon type="riqi"/>,
      onChange(val: moment.Moment) {
        const time = moment(val).format(format as string);
        onChange && onChange(val ? moment(time).valueOf() : undefined);
      },
    };
    let formatStr: string = '';
    if (format === 'YYYY-MM-DD HH:mm:ss') {
      prop.showTime = true;
      formatStr = 'YYYY-MM-DD HH:mm:ss';
    } else if (format === 'YYYY-MM-DD') {
      formatStr = 'YYYY-MM-DD';
    } else {
      formatStr = 'YYYY-MM-DD';
    }
    prop.format = formatStr;
    if (notSelectPassed) {
      prop.disabledDate = (current: Moment) => {
        return current && current < moment().endOf('second');
      };
    }
    if (defaultValue) {
      prop.defaultValue = typeof defaultValue === 'number' ? moment(defaultValue) : defaultValue;
    }
    if (value) {
      prop.value = typeof value === 'number' ? moment(value) : value;
    }

    return Object.assign({}, props, prop);
  }, [format, notSelectPassed, defaultValue, value, props, onChange]);
  return <DatePicker {...propList} style={{width: '100%'}} key={defaultValue?.toString()} disabledDate={disabledDate}/>;
};
export default memo(Date);
