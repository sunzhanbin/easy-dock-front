import { memo, useState, useMemo, useEffect } from 'react';
import styles from './index.module.scss';
import { Icon } from '@common/components';
import { InputNumber, Select } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { InputNumberField, NumberDefaultOption } from '@type';
import CalculateSelect from './calculate-select';
import { useAppSelector } from '@app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';

interface NumberOptionProps {
  id: string;
  value?: { [key: string]: any };
  onChange?: (v: NumberDefaultOption) => void;
}

const { Option } = Select;
const defaultOptions = [
  { key: 'custom', value: '自定义' },
  { key: 'calculate', value: '公式计算' },
];
const calculateOptions = [
  { key: 'add', value: '加法' },
  { key: 'minus', value: '减法' },
  { key: 'sum', value: '求和' },
  { key: 'average', value: '平均值' },
  { key: 'count', value: '计数' },
  { key: 'deduplicate', value: '去重计数' },
  { key: 'max', value: '最大值' },
  { key: 'min', value: '最小值' },
];
const NumberOption = (props: NumberOptionProps) => {
  const byId = useAppSelector(componentPropsSelector);
  const { id, onChange } = props;

  const fieldNumber = useMemo(() => {
    return byId[id] as InputNumberField;
  }, [id, byId]);
  // 默认值类型选择
  const [type, setType] = useState<string>('');
  // 公式计算类型选择
  const [calcType, setCalcType] = useState<string | undefined>(undefined);
  // 自定义数值类型
  const [customData, setCustomData] = useState<number | undefined>(undefined);
  // 公式计算的表单字段
  const [calculateData, setCalculateData] = useState<string | string[]>([]);

  useEffect(() => {
    if (!fieldNumber) return;
    const { defaultNumber } = fieldNumber;
    setType(defaultNumber?.type || 'custom');
    setCustomData(defaultNumber?.customData || undefined);
    setCalcType(defaultNumber?.calcType);
    setCalculateData(defaultNumber?.calculateData || []);
  }, [fieldNumber]);

  // 默认值的小数位数 默认值的数值范围
  const defaultNumberProps = useMemo(() => {
    if (!fieldNumber) return null;
    const { decimal, numlimit } = fieldNumber!;
    return {
      precision: decimal?.enable ? decimal?.precision : 10,
      min: numlimit?.numrange?.min,
      max: numlimit?.numrange?.max,
    };
  }, [fieldNumber]);

  // 改变默认值类型
  const handleChange = useMemoCallback((value: string) => {
    onChange && onChange({ id, type: value, calculateData: undefined, calcType: undefined, customData: undefined });
  });
  const handleInputBlur = useMemoCallback((value) => {
    onChange && onChange({ id, type, customData: value });
  });
  // 改变公式计算类型
  const handleChangeCalcType = useMemoCallback((value) => {
    onChange && onChange({ id, type, calcType: value, calculateData: [] });
  });
  // 改变公式计算表单控件
  const handleCalcChange = useMemoCallback((value) => {
    onChange && onChange({ id, type, calcType, calculateData: value });
  });

  const renderContent = useMemoCallback(() => {
    if (!fieldNumber) return null;

    if (type === 'custom') {
      return (
        <div className={styles.custom_select}>
          <InputNumber
            size="large"
            className="input_number"
            placeholder="请输入"
            formatter={(value: any) => {
              if (!defaultNumberProps?.precision || !value || value.indexOf('.') === -1) return value;
              return value.substring(0, value.indexOf('.') + defaultNumberProps.precision + 1);
            }}
            value={customData}
            onChange={handleInputBlur}
            {...defaultNumberProps}
          />
        </div>
      );
    } else if (type === 'calculate') {
      return (
        <>
          <Select
            className={styles.select_calc}
            size="large"
            suffixIcon={<Icon type="xiala" />}
            placeholder="请选择函数"
            value={calcType}
            onChange={handleChangeCalcType}
          >
            {calculateOptions.map(({ key, value }) => (
              <Option value={key} key={key}>
                {value}
              </Option>
            ))}
          </Select>
          <CalculateSelect id={id} calcType={calcType} calculateData={calculateData} onChange={handleCalcChange} />
        </>
      );
    }
  });
  return (
    <>
      <Select
        placeholder="请选择"
        className={styles.dict_content}
        size="large"
        suffixIcon={<Icon type="xiala" />}
        value={type}
        onChange={handleChange}
      >
        {defaultOptions.map(({ key, value }) => (
          <Option value={key} key={key}>
            {value}
          </Option>
        ))}
      </Select>
      {renderContent()}
    </>
  );
};

export default memo(NumberOption, (prev, next) => prev.id === next.id);
