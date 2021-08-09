import { memo } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import useMemoCallback from '@common/hooks/use-memo-callback';

function TimesDatePicker(props: {
  value?: number;
  onChange?(value?: number): void;
  disabledDate?(time: Moment): boolean;
}) {
  const { value, onChange, disabledDate } = props;
  console.info(222);
  const handleChange = useMemoCallback((value: Moment | null) => {
    console.info(1111);
    if (onChange) {
      console.info(value, 222);
      onChange((value && value.valueOf()) || 0);
    }
  });

  return (
    <DatePicker
      value={value ? moment(value) : undefined}
      showTime
      size="large"
      onChange={handleChange}
      disabledDate={disabledDate}
    />
  );
}

export default memo(TimesDatePicker);
