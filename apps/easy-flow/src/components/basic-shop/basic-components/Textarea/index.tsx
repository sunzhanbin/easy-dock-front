import React, { memo } from 'react';
import { Input } from 'antd';
import { MultipleTextField } from '@/type';

const { TextArea } = Input;

const TextareaComponent = (props: MultipleTextField) => {
  const { defaultValue, readonly } = props;

  return <TextArea rows={4} value={defaultValue} defaultValue={defaultValue} size="large" readOnly={readonly} />;
};

export default memo(TextareaComponent);
