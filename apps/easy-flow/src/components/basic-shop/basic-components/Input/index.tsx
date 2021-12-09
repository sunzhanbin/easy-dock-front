import { memo } from 'react';
import BaseInput from './base-input';
import { InputProps } from 'antd/lib/input';
import EventHoc from '@/components/form-engine/eventHoc';

const InputComponent = (props: InputProps & { unique: boolean } & { [key: string]: any }) => {
  return (
    <EventHoc>
      <BaseInput {...props} />
    </EventHoc>
  );
};

export default memo(InputComponent);
