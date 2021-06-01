import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import React, { memo, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Select } from 'antd';
import { OptionItem, SelectField } from '@/type';

const { Option } = Select;

const Container = styled.div``;

interface editProps {
  id: string;
  value?: string;
  onChange?: (v: string) => void;
}

const SelectDefaultOption = (props: editProps) => {
  const { id, value, onChange } = props;
  const byId = useAppSelector(componentPropsSelector);
  const optionList = useMemo(() => {
    return (byId[id] as SelectField)?.selectOptionList?.content || [];
  }, [id, byId]);
  const isMultiple = useMemo(() => {
    return (byId[id] as SelectField)?.multiple;
  }, [id, byId]);
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean } = { size: 'large', placeholder: '请选择' };
    if (isMultiple) {
      prop.mode = 'multiple';
    }
    if (value) {
      prop.defaultValue = value;
    }
    return prop;
  }, [isMultiple, value]);

  const handleChange = useCallback(
    (e) => {
      onChange && onChange(e);
    },
    [onChange],
  );
  return (
    <Container>
      <Select {...propList} onChange={handleChange}>
        {optionList.map(({ key, value }: OptionItem) => (
          <Option value={key} key={key}>
            {value}
          </Option>
        ))}
      </Select>
    </Container>
  );
};

export default memo(SelectDefaultOption);
