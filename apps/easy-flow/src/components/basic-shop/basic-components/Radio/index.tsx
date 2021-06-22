import { memo, useMemo } from 'react';
import { Radio } from 'antd';
import { OptionItem } from '@/type';
import { RadioGroupProps } from 'antd/lib/radio';

const RadioComponent = (props: RadioGroupProps & { readOnly: boolean; options: OptionItem[] }) => {
  const { options, readOnly, onChange } = props;
  const optionList = useMemo(() => {
    return (options || []).map((item: OptionItem) => item.value);
  }, [options]);

  const propList = useMemo(() => {
    return Object.assign({}, props, {
      disabled: readOnly,
      onChange: onChange as Function,
      options: optionList,
    });
  }, [readOnly, props, optionList, onChange]);

  return <Radio.Group {...propList}></Radio.Group>;
};

export default memo(RadioComponent);
