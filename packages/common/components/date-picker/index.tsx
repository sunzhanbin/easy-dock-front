import { memo, useMemo } from 'react';
import moment, { Moment } from 'moment';
import { DatePicker as AntdDataPicker } from 'antd';
import { PickerDateProps, RangePickerDateProps } from 'antd/lib/date-picker/generatePicker';

type DataPickerProps = Omit<PickerDateProps<Moment>, 'value'> & {
  value?: number;
  onChange?(value: number, dateString?: string): void;
};

function DatePicker(props: DataPickerProps) {
  const { value, onChange, ...others } = props;

  const timeValue = useMemo(() => {
    if (typeof value === 'number') return moment(value);

    return value;
  }, [value]);

  const handleTimeChange: DataPickerProps['onChange'] = (val, dateString) => {
    if (!onChange) return;

    if (val) {
      onChange(val.valueOf(), dateString);
    } else {
      onChange(0, dateString);
    }
  };

  return <AntdDataPicker value={timeValue} onChange={handleTimeChange} {...others}></AntdDataPicker>;
}

export default memo(DatePicker);
