import { memo } from 'react';
import { InputNumber } from 'antd';

interface DecimalProps {
  checked?: boolean;
  id?: string;
  onChange?: (v: any) => void;
}

const AllowDecimal = (props: DecimalProps) => {
  console.log(props.checked, 'checked');
  return (
    <>
      {props.checked && (
        <>
          <span>限制</span>
          <InputNumber size="large" style={{ width: '50%', margin: '0 10px' }} min={1} max={10} placeholder="" />
          <span>位</span>
        </>
      )}
    </>
  );
};

export default memo(AllowDecimal);
