import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { DatePicker } from 'antd';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { useAppSelector } from '@/app/hooks';

const Container = styled.div``;
interface editProps {
  id: string;
  value?: string;
  onChange?: (v: string) => void;
}

const DefaultDate = (props: editProps) => {
  const { id, value, onChange } = props;
  const byId = useAppSelector(componentPropsSelector);
    
  return (
    <Container>
      <DatePicker size="large" />
    </Container>
  );
};

export default memo(DefaultDate);
