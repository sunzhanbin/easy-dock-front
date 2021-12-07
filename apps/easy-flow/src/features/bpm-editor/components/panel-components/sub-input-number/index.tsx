import { memo, useMemo } from 'react';
import { InputNumber } from 'antd';
import { useAppSelector } from '@/app/hooks';
import { subComponentConfigSelector } from '@/features/bpm-editor/form-design/formzone-reducer';

interface SubInputNumberProps {
  id: string;
  value?: number;
  onChange?: (val: this['value']) => void;
}

const SubInputNumber = ({ id, value, onChange }: SubInputNumberProps) => {
  const subAppConfig = useAppSelector(subComponentConfigSelector);
  const decimal = useMemo(() => {
    if (subAppConfig?.id === id) {
      return subAppConfig?.decimal;
    }
    return null;
  }, [subAppConfig, id]);
  const numberRange = useMemo(() => {
    if (subAppConfig?.id === id) {
      return subAppConfig?.numrange;
    }
    return null;
  }, [subAppConfig, id]);
  const propList = useMemo(() => {
    const props: { [k: string]: any } = {
      size: 'large',
      className: 'input_number',
      placeholder: '请输入',
      value,
      onChange,
    };
    if (decimal && decimal.enable && decimal.precision) {
      props.precision = decimal.precision;
    }
    if (numberRange && numberRange.enable && numberRange.min) {
      props.min = numberRange.min;
    }
    if (numberRange && numberRange.enable && numberRange.max) {
      props.max = numberRange.max;
    }
    if (decimal && decimal.enable && decimal.precision) {
      props.formatter = (value: number | string) => {
        const number = String(value);
        // 没有小数位数限制或者没有值,直接返回
        if (!decimal?.enable || !number) {
          return number;
        }
        const { precision } = decimal;

        // 小数位数
        const precisionLength = number.split('.')[1].length;

        // 小数位数超出时,截断
        if (precisionLength > precision) {
          return number.substring(0, number.indexOf('.') + decimal.precision + 1);
        }
        return number;
      };
    }
    return props;
  }, [value, decimal, numberRange]);

  return <InputNumber {...propList} />;
};

export default memo(SubInputNumber);
