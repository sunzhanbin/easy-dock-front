import React, { memo } from 'react';
import { Input } from 'antd';
import { SingleTextField } from '@/type';

const InputComponent = (props: SingleTextField & { id: string }) => {
  const { defaultValue } = props;
  return <Input value={defaultValue} defaultValue={defaultValue} size="large" />;
};

export default memo(InputComponent);
