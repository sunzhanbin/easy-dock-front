import { memo, useMemo, useCallback, ReactNode } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { componentPropsSelector, subComponentConfigSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { useAppSelector } from '@/app/hooks';
import { DateField } from '@/type';
import styles from './index.module.scss';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';

interface editProps {
  id: string;
  value?: number;
  onChange?: (v: this['value']) => void;
}

const DefaultDate = (props: editProps) => {
  const { id, value, onChange } = props;
  const byId = useAppSelector(componentPropsSelector);
  const subAppConfig = useAppSelector(subComponentConfigSelector);
  const formatType = useMemo(() => {
    return (byId[id] as DateField)?.format;
  }, [id, byId]);
  const range = useMemo(() => {
    if (subAppConfig?.id === id) {
      return subAppConfig?.datelimit;
    }
    return (byId[id] as DateField)?.datelimit;
  }, [id, byId, subAppConfig]);
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | Function | Moment | ReactNode } = {
      size: 'large',
      suffixIcon: <Icon type="riqi" />,
    };
    if (formatType === 'yyyy-MM-DD HH:mm:ss') {
      props.showTime = true;
      props.format = 'yyyy-MM-DD HH:mm:ss';
    } else if (formatType === 'yyyy-MM-DD') {
      props.format = 'yyyy-MM-DD';
    } else {
      props.format = 'yyyy-MM-DD';
    }
    if (typeof value === 'number') {
      props.value = moment(value);
    }
    return props;
  }, [formatType, value]);
  const handleDisabled = useMemoCallback((current: Moment) => {
    if (range && range?.enable && range.daterange) {
      return current.valueOf() < Number(range.daterange.min) || current.valueOf() > Number(range.daterange.max);
    }
    return false;
  });
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
