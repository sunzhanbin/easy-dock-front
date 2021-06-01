import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { useAppSelector } from '@/app/hooks';
import { DateField } from '@/type';

const Container = styled.div`
  .ant-picker {
    width: 100%;
  }
`;
interface editProps {
  id: string;
  value?: string;
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
    const props: { [k: string]: string | boolean | Function } = { size: 'large' };
    if (formatType === '2') {
      props.showTime = true;
      props.format = 'YYYY-MM-DD HH:mm:ss';
    } else if (formatType === '1') {
      props.format = 'YYYY-MM-DD';
    }
    if (notSelectPassed) {
      props.disabledDate = (current: Moment) => {
        return current && current < moment().endOf('second');
      };
    }
    return props;
  }, [formatType, notSelectPassed]);
  const handleChange = useCallback(
    (e) => {
      const format = formatType === '2' ? 'YYYY-MM-DD HH:mm:ss' : formatType === '1' ? 'YYYY-MM-DD' : 'YYYY-MM-DD';
      onChange && onChange(e.format(format));
    },
    [onChange, formatType],
  );
  return (
    <Container>
      <DatePicker {...propList} locale={locale} onChange={handleChange} />
    </Container>
  );
};

export default memo(DefaultDate);
