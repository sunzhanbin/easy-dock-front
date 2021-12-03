import { memo, useMemo, useCallback, ReactNode } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { useAppSelector } from '@/app/hooks';
import { DateField } from '@/type';
import styles from './index.module.scss';
import { Icon } from '@common/components';

interface editProps {
  id: string;
  value?: number;
  onChange?: (v: this['value']) => void;
}

const DefaultDate = (props: editProps) => {
  const { id, value, onChange } = props;
  const byId = useAppSelector(componentPropsSelector);
  const formatType = useMemo(() => {
    return (byId[id] as DateField)?.format;
  }, [id, byId]);
  const range = useMemo(() => {
    return (byId[id] as DateField)?.datelimit?.daterange;
  }, [id, byId]);
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | Function | Moment | ReactNode } = {
      size: 'large',
      suffixIcon: <Icon type="riqi" />,
    };
    if (formatType === 'yyyy-MM-dd HH:mm:ss') {
      props.showTime = true;
      props.format = 'yyyy-MM-dd HH:mm:ss';
    } else if (formatType === 'yyyy-MM-dd') {
      props.format = 'yyyy-MM-dd';
    } else {
      props.format = 'yyyy-MM-dd';
    }
    if (typeof value === 'number') {
      props.value = moment(value);
    }
    return props;
  }, [formatType, value]);
  const handleDisabled = (current: Moment) => {
    if (range) {
      return current.valueOf() < Number(range.min) || current.valueOf() > Number(range.max);
    }
    return false;
  };
  const handleChange = useCallback(
    (e) => {
      if (e?.valueOf()) {
        onChange && onChange(e.valueOf());
      } else {
        onChange && onChange(undefined);
      }
    },
    [onChange],
  );
  return (
    <div className={styles.container}>
      <DatePicker {...propList} locale={locale} onChange={handleChange} disabledDate={handleDisabled} />
    </div>
  );
};

export default memo(DefaultDate);
