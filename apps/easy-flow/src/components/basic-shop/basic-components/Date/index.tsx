import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { DatePicker } from 'antd';
import { DateField } from '@/type';
import moment, { Moment } from 'moment';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
`;

const Date = (props: DateField) => {
  const { tip, label, format, notSelectPassed, defaultValue } = props;
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | Function | Moment } = { size: 'large' };
    let formatStr: string = '';
    if (format === '2') {
      props.showTime = true;
      formatStr = 'YYYY-MM-DD HH:mm:ss';
    } else if (format === '1') {
      formatStr = 'YYYY-MM-DD';
    }
    props.format = formatStr;
    if (notSelectPassed) {
      props.disabledDate = (current: Moment) => {
        return current && current < moment().endOf('second');
      };
    }
    if (defaultValue) {
      const value = moment(defaultValue, formatStr);
      props.value = value;
      props.defaultValue = value;
    }
    return props;
  }, [format, notSelectPassed, defaultValue]);
  return (
    <Container>
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="tip">{tip}</div>
      </div>
      <DatePicker {...propList} />
    </Container>
  );
};
export default memo(Date);
