import { memo, useMemo } from 'react';
import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import moment, { Moment } from 'moment';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Icon } from '@common/components';

interface DateRangeProps {
  showTime?: boolean;
  format?: string;
  className?: string;
  value?: [number | null, number | null];
  onChange?(value?: this['value']): void;
}

function DateRange(props: DateRangeProps) {
  const { showTime, format, className, value, onChange } = props;

  const mValue = useMemo((): [Moment | null, Moment | null] | undefined => {
    if (!value) return undefined;

    const [start, end] = value;

    return [start ? moment(start) : null, end ? moment(end) : null];
  }, [value]);

  const handleChange: RangePickerProps['onChange'] = useMemoCallback((values) => {
    if (!onChange) return;

    if (!values) {
      onChange(undefined);
    } else {
      const [start, end] = values;
      onChange([start ? start.valueOf() : null, end ? end.valueOf() : null]);
    }
  });

  return (
    <DatePicker.RangePicker
      value={mValue}
      showTime={showTime}
      format={format}
      className={className}
      suffixIcon={<Icon type="riqi" />}
      size="large"
      onChange={handleChange}
    />
  );
}

export default memo(DateRange);
