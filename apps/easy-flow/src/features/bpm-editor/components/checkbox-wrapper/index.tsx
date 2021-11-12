import { memo, FC } from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import useMemoCallback from '@common/hooks/use-memo-callback';

interface IProps {
  label: string;
  value?: boolean;
  onChange?: (val: this['value']) => void;
}

const CheckboxWrapper: FC<IProps> = ({ label, value = false, onChange }) => {
  const handleChange = useMemoCallback((e: CheckboxChangeEvent) => {
    onChange && onChange(e.target.checked);
  });
  return (
    <Checkbox checked={value} onChange={handleChange}>
      {label}
    </Checkbox>
  );
};

export default memo(CheckboxWrapper);
