import { memo } from 'react';
import { DatePicker, DatePickerProps } from 'antd';
import { Icon } from '@common/components';
import moment, { Moment } from 'moment';
import useMemoCallback from '@common/hooks/use-memo-callback';

function TimesDatePicker(
  props: {
    showTime?: boolean;
    value?: number;
    onChange?(value?: number): void;
    disabledDate?(time: Moment): boolean;
  } & DatePickerProps,
) {
  const { value, format, size = 'large', showTime = true, className, onChange, disabledDate } = props;
  const handleChange = useMemoCallback((value: Moment | null) => {
    if (onChange) {
      const time = moment(value).format(format as string);
      onChange((value && moment(time).valueOf()) || 0);
    }
  });

  return (
    <DatePicker
      value={value ? moment(value) : undefined}
      showTime={showTime}
      size={size}
      format={format}
      className={className}
      suffixIcon={<Icon type="riqi" />}
      onChange={handleChange}
      disabledDate={disabledDate}
    />
  );
}

export default memo(TimesDatePicker);
