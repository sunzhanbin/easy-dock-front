import { memo, useMemo } from 'react';
import { Radio } from 'antd';
import { OptionItem } from '@/type';
import { RadioGroupProps } from 'antd/lib/radio';

const RadioComponent = (props: RadioGroupProps & { options: OptionItem[] }) => {
  const { options, onChange } = props;
  const optionList = useMemo(() => {
    return (options || []).map((item: OptionItem) => item.value);
  }, [options]);

  const propList = useMemo(() => {
    return Object.assign({}, props, {
      // eslint-disable-next-line @typescript-eslint/ban-types
      onChange: onChange as Function,
      options: optionList,
    });
  }, [props, optionList, onChange]);

  return <Radio.Group {...propList}></Radio.Group>;
};

export default memo(RadioComponent);
