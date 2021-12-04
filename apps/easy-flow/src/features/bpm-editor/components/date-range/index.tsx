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
    if (!Array.isArray(value)) return undefined;

    const [start, end] = value;

    return [start ? moment(start) : null, end ? moment(end) : null];
  }, [value]);

  const handleChange: RangePickerProps['onChange'] = useMemoCallback((values) => {
    if (!onChange) return;

    if (!Array.isArray(values)) {
      onChange(undefined);
    } else {
      const [start, end] = values;
      // 如果格日期式是到天的话,起始时间是开始日期的00:00:00到结束日期的23:59:59
      if (format === 'yyyy-MM-DD') {
        const startDay = moment(start).format(format);
        const endDay = moment(end).format(format);
        const startTime = startDay ? +moment(startDay).startOf('day').format('x') : null;
        const endTime = endDay ? +moment(endDay).endOf('day').format('x') : null;
        onChange && onChange([startTime, endTime]);
        return;
      }
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
