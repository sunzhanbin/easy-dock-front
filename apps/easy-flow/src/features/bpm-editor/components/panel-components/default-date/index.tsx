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
  onChange?: (v: string) => void;
}

const DefaultDate = (props: editProps) => {
  const { id, value, onChange } = props;
  const byId = useAppSelector(componentPropsSelector);
  const formatType = useMemo(() => {
    return (byId[id] as DateField)?.format;
  }, [id, byId]);
  const notSelectPassed = useMemo(() => {
    return (byId[id] as DateField)?.notSelectPassed;
  }, [id, byId]);
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | Function | Moment | ReactNode } = {
      size: 'large',
      suffixIcon: <Icon type="riqi" />,
    };
    if (formatType === 'YYYY-MM-DD HH:mm:ss') {
      props.showTime = true;
      props.format = 'YYYY-MM-DD HH:mm:ss';
    } else if (formatType === 'YYYY-MM-DD') {
      props.format = 'YYYY-MM-DD';
    } else {
      props.format = 'YYYY-MM-DD';
    }
    if (notSelectPassed) {
      props.disabledDate = (current: Moment) => {
        return current && current < moment().endOf('second');
      };
    }
    if (typeof value === 'number') {
      props.value = moment(value);
    }
    return props;
  }, [formatType, notSelectPassed, value]);
  const handleChange = useCallback(
    (e) => {
      if (e.valueOf()) {
        onChange && onChange(e.valueOf());
      }
    },
    [onChange],
  );
  return (
    <div className={styles.container}>
      <DatePicker {...propList} locale={locale} onChange={handleChange} />
    </div>
  );
};

export default memo(DefaultDate);
