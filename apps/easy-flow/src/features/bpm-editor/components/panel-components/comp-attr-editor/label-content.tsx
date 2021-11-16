import { FC, memo, useState } from 'react';
import { Checkbox } from 'antd';
import styles from './index.module.scss';

interface LabelContentProps {
  checked?: boolean;
  type?: string;
  label?: string;
  onChange?: (v: any) => void;
}

const PanelLabelContent = (props: LabelContentProps) => {
  const { checked, type, label, onChange } = props;
  const [check, setCheck] = useState(checked);
  const handleChange = (e: any) => {
    setCheck(e.target.checked);
    onChange && onChange(e.target.checked);
  };

  // if (type === 'AllowDecimal' || type === 'LimitRange') {
  //   return (
  //     <>
  //       <Checkbox className={styles.checkbox} checked={check} onChange={handleChange}>
  //         {label}
  //       </Checkbox>
  //     </>
  //   );
  // } else {
  return <span>{label}</span>;
  // }
};

export default memo(PanelLabelContent);
