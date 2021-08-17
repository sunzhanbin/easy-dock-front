import { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { Form, Select, Input, InputNumber } from 'antd';
import classnames from 'classnames';
import { filedRule, FormField } from '@/type';
import { symbolMap, dynamicMap } from '@/utils';
import { Icon } from '@common/components';
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
  rule: filedRule;
  blockIndex: number;
  ruleIndex: number;
  onChange?: (blockIndex: number, ruleIndex: number, rule: filedRule) => void;
  loadDataSource?: (id: string) => Promise<{ key: string; value: string }[] | { data: { data: string[] } }>;
};

const RuleForm = ({ rule, className, components, blockIndex, ruleIndex, onChange, loadDataSource }: RuleFormProps) => {
  const [form] = Form.useForm();
  const initValues = useMemo(() => {
    return {
      fieldId: rule.fieldId || undefined,
      symbol: rule.symbol || undefined,
      value: rule.value || undefined,
    };
  }, [rule]);

  const componentList = useMemo(() => {
    if (components && components?.length > 0) {
      const list = [...components];
      return (
        list
          .filter((item: { type: string }) => item.type !== 'DescText')
          .map((item: FormField) => ({
            label: item.label,
            id: item.id!,
            type: item.type,
            format: (item as any).format,
          })) || []
      );
    }
    return [];
  }, [components]);
  const [optionList, setOptionList] = useState<{ key: string; value: string }[]>([]);
  const [selectComponent, setSelectComponent] = useState<{ id: string; type: string; format: string; label: string }>();
  const setDataSource = useCallback(
    (fieldId, fieldType) => {
      if (loadDataSource && (fieldType === 'Select' || fieldType === 'Radio' || fieldType === 'Checkbox')) {
        loadDataSource(fieldId).then((res) => {
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
        });
      }
    },
    [loadDataSource, setOptionList],
  );
  const changeField = useCallback(
    (id) => {
      setTimeout(() => {
        form.setFieldsValue({ fieldId: id, symbol: undefined, value: undefined });
      }, 0);
      const fieldId = form.getFieldValue('fieldId');
      const component = componentList.find((item) => item.id === fieldId);
      setSelectComponent(component);
      const fieldType = component && (component.type as string);
      setDataSource(fieldId, fieldType);
    },
    [form, componentList, setDataSource],
  );
  const changeSymbol = useCallback(
    (symbol) => {
      const fieldId = form.getFieldValue('fieldId');
      setTimeout(() => {
        form.setFieldsValue({ fieldId, symbol, value: undefined });
      }, 0);
    },
    [form],
  );
  const handleFinish = useCallback(() => {
    const values = form.getFieldsValue();
    if (rule.fieldId !== values.fieldId) {
      let newRule: filedRule = Object.assign({}, values, {
        symbol: undefined,
        value: undefined,
        fieldType: values.fieldId.split('_')[0],
      });
      if (selectComponent) {
        newRule = Object.assign({}, newRule, { fieldType: selectComponent!.type });
      }
      onChange && onChange(blockIndex, ruleIndex, newRule);
      return;
    }
    if (rule.symbol !== values.symbol) {
      let newRule: filedRule = Object.assign({}, values, { value: undefined, fieldType: values.fieldId.split('_')[0] });
      if (selectComponent) {
        newRule = Object.assign({}, newRule, { fieldType: selectComponent!.type });
      }
      onChange && onChange(blockIndex, ruleIndex, newRule);
      return;
    }
    if (values.value !== undefined && rule.value !== values.value) {
      let newRule: filedRule = Object.assign({}, values, { fieldType: values.fieldId.split('_')[0] });
      if (selectComponent) {
        newRule = Object.assign({}, newRule, { fieldType: selectComponent!.type });
      }
      onChange && onChange(blockIndex, ruleIndex, newRule);
    }
  }, [form, blockIndex, ruleIndex, rule, selectComponent, onChange]);
  useEffect(() => {
    if (rule) {
      form.setFieldsValue({
        fieldId: rule.fieldId || undefined,
        symbol: rule.symbol || undefined,
        value: rule.value || undefined,
      });
      if (rule.fieldId) {
        const fieldType = rule.fieldType;
        setDataSource(rule.fieldId, fieldType);
      }
    }
  }, [rule, form, setDataSource]);
  const renderSymbol = useCallback(() => {
    const fieldId = form.getFieldValue('fieldId') || initValues.fieldId;
    const component = componentList.find((item) => item.id === fieldId);
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
      <Form.Item name="symbol">
        <Select
          placeholder="判断符"
          size="large"
          className={styles.symbol}
          suffixIcon={<Icon type="xiala" />}
          onChange={changeSymbol}
        >
          {symbolList.map(({ value, label }) => (
            <Option key={value} value={value} label={label}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  }, [form, initValues, componentList, changeSymbol]);
  const renderValue = useCallback(() => {
    const fieldId = form.getFieldValue('fieldId') || initValues.fieldId;
    const symbol = form.getFieldValue('symbol') || initValues.symbol;
    const component = componentList.find((item) => item.id === fieldId);
    const componentType = component && (component.type as string);
    if (symbol === 'null' || symbol === 'notNull') {
      return null;
    }
    // 文本类型
    if (componentType === 'Input' || componentType === 'Textarea') {
      // 输入单个值
      if (symbol === 'equal' || symbol === 'unequal' || symbol === 'include' || symbol === 'exclude') {
        return (
          <Form.Item name="value" className={styles.valueWrapper}>
            <Input placeholder="输入值" size="large" className={styles.value} />
          </Form.Item>
        );
      }
      // 输入多个值
      if (symbol === 'equalAnyOne' || symbol === 'unequalAnyOne') {
        return (
          <Form.Item name="value" className={styles.valueWrapper}>
            <MultiText className={styles.value} />
          </Form.Item>
        );
      }
      return null;
    }
    // 数字类型
    if (componentType === 'InputNumber') {
      if (symbol === 'range') {
        return (
          <Form.Item name="value" className={styles.valueWrapper}>
            <NumberRange className={styles.value} />
          </Form.Item>
        );
      }
      if (symbol) {
        return (
          <Form.Item name="value" className={styles.valueWrapper}>
            <InputNumber placeholder="输入值" size="large" className={styles.value} />
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
          <Form.Item name="value" className={styles.valueWrapper}>
            <Select placeholder="请选择" size="large" className={styles.value}>
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
      const showTime = format === 'YYYY-MM-DD HH:mm:ss' ? true : false;
      if (symbol === 'range') {
        return (
          <Form.Item name="value" className={styles.valueWrapper}>
            <DateRange format={format} showTime={showTime} className={styles.value} />
          </Form.Item>
        );
      }
      if (symbol) {
        return (
          <Form.Item name="value" className={styles.valueWrapper}>
            <TimesDatePicker className={styles.value} format={format} showTime={showTime} size="large" />
          </Form.Item>
        );
      }
      return null;
    }
    // 选项类型(下拉,单选,多选)
    if (componentType === 'Select' || componentType === 'Radio' || componentType === 'Checkbox') {
      if (symbol === 'include' || symbol === 'exclude') {
        return (
          <Form.Item name="value" className={styles.valueWrapper}>
            <Input placeholder="输入值" size="large" className={styles.value} />
          </Form.Item>
        );
      }
      if (symbol === 'equal' || symbol === 'unequal') {
        const mode: { mode: 'multiple' } | null = componentType === 'Checkbox' ? { mode: 'multiple' } : null;
        return (
          <Form.Item name="value" className={styles.valueWrapper}>
            <Select
              placeholder="请选择"
              size="large"
              className={styles.value}
              suffixIcon={<Icon type="xiala" />}
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
        return (
          <Form.Item name="value" className={styles.valueWrapper}>
            <Select
              placeholder="请选择"
              mode="multiple"
              size="large"
              className={styles.value}
              suffixIcon={<Icon type="xiala" />}
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
  }, [form, initValues, componentList, optionList]);
  return (
    <Form
      className={classnames(styles.form, className ? className : '')}
      form={form}
      layout="inline"
      autoComplete="off"
      style={{ marginBottom: '8px', marginTop: '0' }}
      initialValues={initValues}
      onValuesChange={handleFinish}
    >
      <Form.Item name="fieldId" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Select
          placeholder="关联字段"
          size="large"
          className={styles.fieldId}
          onChange={changeField}
          suffixIcon={<Icon type="xiala" />}
        >
          {componentList.map(({ id, label }) => (
            <Option key={id} value={id} label={label}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {renderSymbol()}
      {renderValue()}
    </Form>
  );
};

export default memo(RuleForm);
