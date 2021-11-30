import { memo } from 'react';
import { DatePicker, DatePickerProps } from 'antd';
import { Icon } from '@common/components';
import moment, { Moment } from 'moment';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { getPopupContainer } from '@utils';

function TimesDatePicker(
  props: {
    showTime?: boolean;
    value?: number;
    onChange?(value?: number): void;
    disabledDate?(time: Moment): boolean;
    type?: string;
  } & DatePickerProps,
) {
  const { value, format, size = 'large', showTime = true, className, onChange, disabledDate, type } = props;
  const handleChange = useMemoCallback((value: Moment | null) => {
    if (onChange) {
      const time = moment(value).format(format as string);
      if (type === 'startTime' && format === 'YYYY-MM-DD') {
        onChange((value && moment(time).startOf('day').valueOf()) || 0);
        return;
      }
      if (type === 'endTime' && format === 'YYYY-MM-DD') {
        onChange((value && moment(time).endOf('day').valueOf()) || 0);
        return;
      }
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
      getPopupContainer={getPopupContainer}
      onChange={handleChange}
      disabledDate={disabledDate}
    />
  );
}

export default memo(TimesDatePicker);
