import { memo, useMemo, useState, useEffect } from 'react';
import { Form, Select, Input, InputNumber } from 'antd';
import classnames from 'classnames';
import { DateField, fieldRule, FormField, SelectField } from '@/type';
import { symbolMap, dynamicMap } from '@/utils';
import { Icon, Loading } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import MultiText from '@/features/bpm-editor/components/multi-text';
import NumberRange from '@/features/bpm-editor/components/number-range';
import TimesDatePicker from '@/features/bpm-editor/components/date-picker';
import DateRange from '@/features/bpm-editor/components/date-range';
import styles from './index.module.scss';

const { Option } = Select;

const symbolListMap = {
  text: [
    symbolMap.equal,
    symbolMap.unequal,
    symbolMap.equalAnyOne,
    symbolMap.unequalAnyOne,
    symbolMap.include,
    symbolMap.exclude,
    symbolMap.null,
    symbolMap.notNull,
  ],
  number: [
    symbolMap.equal,
    symbolMap.unequal,
    symbolMap.greater,
    symbolMap.greaterOrEqual,
    symbolMap.less,
    symbolMap.lessOrEqual,
    symbolMap.range,
    symbolMap.null,
    symbolMap.notNull,
  ],
  date: [
    symbolMap.equal,
    symbolMap.unequal,
    symbolMap.greaterOrEqual,
    symbolMap.lessOrEqual,
    symbolMap.range,
    symbolMap.dynamic,
    symbolMap.null,
    symbolMap.notNull,
  ],
  option: [
    symbolMap.equal,
    symbolMap.unequal,
    symbolMap.equalAnyOne,
    symbolMap.unequalAnyOne,
    symbolMap.include,
    symbolMap.exclude,
    symbolMap.null,
    symbolMap.notNull,
  ],
  other: [symbolMap.null, symbolMap.notNull],
};

type RuleFormProps = {
  components: Array<any>;
  className?: string;
  rule: fieldRule;
  name: string;
  blockIndex: number;
  ruleIndex: number;
  onChange?: (blockIndex: number, ruleIndex: number, rule: fieldRule) => void;
  loadDataSource?: (id: string) => Promise<{ key: string; value: string }[] | { data: { data: string[] } }>;
};
const FormList = ({
  components,
  className,
  rule,
  name,
  blockIndex,
  ruleIndex,
  onChange,
  loadDataSource,
}: RuleFormProps) => {
  const [fieldName, setFieldName] = useState<string | undefined>(undefined);
  const [symbol, setSymbol] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<string | number | string[] | [number, number] | undefined>(undefined);
  const [optionList, setOptionList] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const nameList = useMemo(() => {
    return [name, blockIndex, ruleIndex];
  }, [blockIndex, ruleIndex, name]);
  const componentList = useMemo(() => {
    if (components && components?.length > 0) {
      const list = [...components];
      return (
        list
          .filter((item: { type: string }) => item.type !== 'DescText')
          .map((item: FormField) => ({
            label: item.label,
            id: item.id,
            type: item.type,
            format: (item as DateField).format,
            sourceType: (item as SelectField).dataSource?.type || '',
            fieldName: item.fieldName,
            multiple: (item as SelectField)?.multiple || false,
          })) || []
      );
    }
    return [];
  }, [components]);
  const setDataSource = useMemoCallback((fieldName, fieldType) => {
    if (loadDataSource && (fieldType === 'Select' || fieldType === 'Radio' || fieldType === 'Checkbox')) {
      setLoading(true);
      loadDataSource(fieldName)
        .then((res) => {
          if (res) {
            // 如果返回的是一个key-value数组,直接赋值给下拉选项
            if (Array.isArray(res)) {
              setOptionList(res);
              // 如果返回的直接是接口数据,需要做一个转换
            } else if (res.data) {
              const list = (res.data?.data || []).map((val: string) => ({ key: val, value: val }));
              setOptionList(list);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  });
  const changeField = useMemoCallback((fieldName) => {
    setFieldName(fieldName);
    setSymbol(undefined);
    setValue(undefined);
    const component = componentList.find((item) => item.fieldName === fieldName);
    const fieldType = component && (component.type as string);
    setDataSource(fieldName, fieldType);
    const fieldRule = {
      fieldName: fieldName,
      fieldType: component?.type || rule.fieldType,
    };
    onChange && onChange(blockIndex, ruleIndex, fieldRule);
  });
  const changeSymbol = useMemoCallback((symbol) => {
    setSymbol(symbol);
    setValue(undefined);
    const selectComponent = componentList.find((item) => item.fieldName === fieldName);
    const fieldRule = {
      fieldName: fieldName,
      symbol: symbol,
      fieldType: selectComponent?.type || rule.fieldType,
    };
    onChange && onChange(blockIndex, ruleIndex, fieldRule);
  });
  const changeValue = useMemoCallback((value) => {
    setValue(value);
    const selectComponent = componentList.find((item) => item.fieldName === fieldName);
    const fieldRule = {
      fieldName: fieldName,
      symbol: symbol,
      value: value,
      fieldType: selectComponent?.type || rule.fieldType,
    };
    onChange && onChange(blockIndex, ruleIndex, fieldRule);
  });
  const init = useMemoCallback(() => {
    const { fieldName, symbol, value, fieldType } = rule;
    setFieldName(fieldName);
    setSymbol(symbol);
    setValue(value);
    if (fieldName) {
      const type = fieldType;
      setDataSource(fieldName, type);
    }
  });

  const getPopupContainer = useMemo(() => {
    return (node: HTMLDivElement) => node;
  }, []);

  useEffect(() => {
    if (rule) {
      init();
    }
  }, [init, rule]);
  const renderSymbol = useMemoCallback(() => {
    const component = componentList.find((item) => item.fieldName === fieldName);
    const componentType = component && component.type;
    let symbolList: { value: string; label: string }[] = [];
    if (componentType) {
      switch (componentType as string) {
        case 'Input':
        case 'Textarea':
          symbolList = symbolListMap.text;
          break;
        case 'InputNumber':
          symbolList = symbolListMap.number;
          break;
        case 'Date':
          symbolList = symbolListMap.date;
          break;
        case 'Select':
        case 'Radio':
        case 'Checkbox':
          symbolList = symbolListMap.option;
          break;
        default:
          symbolList = symbolListMap.other;
          break;
      }
    }
    return (
      <Form.Item name="symbol" rules={[{ required: true, message: '请选择判断符!' }]}>
        <Select
          placeholder="判断符"
          size="large"
          value={symbol}
          className={styles.symbol}
          suffixIcon={<Icon type="xiala" />}
          onChange={changeSymbol}
          getPopupContainer={getPopupContainer}
        >
          {symbolList.map(({ value, label }) => (
            <Option key={value} value={value} label={label}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  });
  const renderValue = useMemoCallback(() => {
    const component = componentList.find((item) => item.fieldName === fieldName);
    const componentType = component && (component.type as string);
    const multiple = component?.multiple || false;
    if (symbol === 'null' || symbol === 'notNull') {
      return null;
    }
    // 文本类型
    if (componentType === 'Input' || componentType === 'Textarea') {
      // 输入单个值
      if (symbol === 'equal' || symbol === 'unequal' || symbol === 'include' || symbol === 'exclude') {
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请输入!' }]}>
            <Input
              placeholder="输入值"
              size="large"
              className={styles.value}
              value={value as string}
              onChange={(e) => {
                changeValue(e.target.value);
              }}
            />
          </Form.Item>
        );
      }
      // 输入多个值
      if (symbol === 'equalAnyOne' || symbol === 'unequalAnyOne') {
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请输入!' }]}>
            <MultiText className={styles.value} value={value as string[]} onChange={changeValue} />
          </Form.Item>
        );
      }
      return null;
    }
    // 数字类型
    if (componentType === 'InputNumber') {
      if (symbol === 'range') {
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请输入!' }]}>
            <NumberRange className={styles.value} value={value as [number, number]} onChange={changeValue} />
          </Form.Item>
        );
      }
      if (symbol) {
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请输入!' }]}>
            <InputNumber
              placeholder="输入值"
              size="large"
              className={styles.value}
              value={value as number}
              onChange={changeValue}
            />
          </Form.Item>
        );
      }
      return null;
    }
    // 日期类型
    if (componentType === 'Date') {
      // 动态筛选
      if (symbol === 'dynamic') {
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请选择!' }]}>
            <Select
              placeholder="请选择"
              size="large"
              className={styles.value}
              value={value as string}
              onChange={changeValue}
              getPopupContainer={getPopupContainer}
            >
              {Object.values(dynamicMap).map((item) => (
                <Option key={item.value} value={item.value} label={item.label}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      }
      const format = component && component.format;
      const showTime = format === 'YYYY-MM-DD HH:mm:ss';
      if (symbol === 'range') {
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请选择!' }]}>
            <DateRange
              format={format}
              showTime={showTime}
              className={styles.value}
              value={value as [number, number]}
              onChange={changeValue}
            />
          </Form.Item>
        );
      }
      if (symbol) {
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请选择!' }]}>
            <TimesDatePicker
              className={styles.value}
              format={format}
              showTime={showTime}
              size="large"
              value={value as any}
              onChange={changeValue}
            />
          </Form.Item>
        );
      }
      return null;
    }
    // 选项类型(下拉,单选,多选)
    if (componentType === 'Select' || componentType === 'Radio' || componentType === 'Checkbox') {
      if (symbol === 'include' || symbol === 'exclude') {
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请输入!' }]}>
            <Input
              placeholder="输入值"
              size="large"
              className={styles.value}
              value={value as string}
              onChange={(e) => {
                changeValue(e.target.value);
              }}
            />
          </Form.Item>
        );
      }
      if (symbol === 'equal' || symbol === 'unequal') {
        const mode: { mode: 'multiple' } | null =
          componentType === 'Checkbox' || multiple ? { mode: 'multiple' } : null;
        const sourceType = component?.sourceType || '';
        if (sourceType === 'interface' || sourceType === undefined) {
          if (componentType === 'Checkbox' || multiple) {
            return (
              <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请输入!' }]}>
                <MultiText className={styles.value} value={value as string[]} onChange={changeValue} />
              </Form.Item>
            );
          }
          return (
            <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请输入!' }]}>
              <Input
                placeholder="输入值"
                size="large"
                className={styles.value}
                value={value as string}
                onChange={(e) => {
                  changeValue(e.target.value);
                }}
              />
            </Form.Item>
          );
        }
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请选择!' }]}>
            <Select
              placeholder="请选择"
              size="large"
              className={styles.value}
              suffixIcon={<Icon type="xiala" />}
              value={value as string | string[]}
              onChange={changeValue}
              getPopupContainer={getPopupContainer}
              {...mode}
            >
              {optionList.map(({ key, value }) => (
                <Option key={key} value={key} label={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      }
      if (symbol === 'equalAnyOne' || symbol === 'unequalAnyOne') {
        const sourceType = component?.sourceType || '';
        if (sourceType === 'interface' || sourceType === undefined) {
          return (
            <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请输入!' }]}>
              <MultiText className={styles.value} value={value as string[]} onChange={changeValue} />
            </Form.Item>
          );
        }
        return (
          <Form.Item name="value" className={styles.valueWrapper} rules={[{ required: true, message: '请选择!' }]}>
            <Select
              placeholder="请选择"
              mode="multiple"
              size="large"
              className={styles.value}
              suffixIcon={<Icon type="xiala" />}
              value={value as string[]}
              onChange={changeValue}
              getPopupContainer={getPopupContainer}
            >
              {optionList.map(({ key, value }) => (
                <Option key={key} value={key} label={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      }
      if (!symbol) {
        return null;
      }
    }
    return null;
  });
  return (
    <Form.Item className={classnames(styles.form, className ? className : '')}>
      <Form.List name={nameList}>
        {() => {
          return (
            <>
              {loading && <Loading className={styles.loading} />}
              <Form.Item name="fieldName" rules={[{ required: true, message: '请选择关联字段!' }]}>
                <Select
                  placeholder="关联字段"
                  size="large"
                  className={styles.fieldName}
                  value={fieldName}
                  onChange={changeField}
                  getPopupContainer={getPopupContainer}
                  suffixIcon={<Icon type="xiala" />}
                >
                  {componentList.map(({ fieldName, label }) => (
                    <Option key={fieldName} value={fieldName} label={label}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {renderSymbol()}
              {renderValue()}
            </>
          );
        }}
      </Form.List>
    </Form.Item>
  );
};

export default memo(FormList);
