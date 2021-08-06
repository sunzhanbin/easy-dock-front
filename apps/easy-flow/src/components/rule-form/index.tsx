import { memo, useMemo, useCallback, useState } from 'react';
import { Form, Select, Input, InputNumber, DatePicker } from 'antd';
import classnames from 'classnames';
import { filedRule, FormField } from '@/type';
import { Icon } from '@common/components';
import MultiText from '@components/multi-text';
import NumberRange from '@components/number-range';
import styles from './index.module.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;
const symbolListMap = {
  text: [
    { value: 'equal', label: '等于' },
    { value: 'unequal', label: '不等于' },
    { value: 'equalAnyOne', label: '等于任意一个' },
    { value: 'unequalAnyOne', label: '不等于任意一个' },
    { value: 'include', label: '包含' },
    { value: 'exclude', label: '不包含' },
    { value: 'null', label: '为空' },
    { value: 'notNull', label: '不为空' },
  ],
  number: [
    { value: 'equal', label: '等于' },
    { value: 'unequal', label: '不等于' },
    { value: 'greater', label: '大于' },
    { value: 'greaterOrEqual', label: '大于等于' },
    { value: 'less', label: '小于' },
    { value: 'lessOrEqual', label: '小于等于' },
    { value: 'range', label: '选择范围' },
    { value: 'null', label: '为空' },
    { value: 'notNull', label: '不为空' },
  ],
  date: [
    { value: 'equal', label: '等于' },
    { value: 'unequal', label: '不等于' },
    { value: 'greaterOrEqual', label: '大于等于' },
    { value: 'lessOrEqual', label: '小于等于' },
    { value: 'range', label: '选择范围' },
    { value: 'dynamic', label: '动态筛选' },
    { value: 'null', label: '为空' },
    { value: 'notNull', label: '不为空' },
  ],
  option: [
    { value: 'equal', label: '等于' },
    { value: 'unequal', label: '不等于' },
    { value: 'equalAnyOne', label: '等于任意一个' },
    { value: 'unequalAnyOne', label: '不等于任意一个' },
    { value: 'include', label: '包含' },
    { value: 'exclude', label: '不包含' },
    { value: 'null', label: '为空' },
    { value: 'notNull', label: '不为空' },
  ],
  other: [
    { value: 'null', label: '为空' },
    { value: 'notNull', label: '不为空' },
  ],
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
      field: rule.field || undefined,
      symbol: rule.symbol || undefined,
      value: rule.value || undefined,
    };
  }, [rule]);
  const componentList = useMemo(() => {
    if (components && components?.length > 0) {
      let list = [];
      // 流程编排阶段从远程拉取components数据,配置中有config节点
      if (components[0].config) {
        list = components.map((item: any) => item.config);
      } else {
        // 表单编排阶段尚未保存数据,只能从redux中读取components中读取配置，没有config节点
        list = [...components];
      }
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
  const [selectComponent, setSelectComponent] = useState<{ id: string; type: string; format: string }>();
  const changeField = useCallback(() => {
    form.setFieldsValue({ symbol: undefined, value: undefined });
    const fieldId = form.getFieldValue('field');
    const field = componentList.find((item) => item.id === fieldId);
    setSelectComponent(field);
    const fieldType = field && (field.type as string);
    if (loadDataSource && (fieldType === 'Select' || fieldType === 'Radio' || fieldType === 'Checkbox')) {
      loadDataSource(fieldId).then((res) => {
        if (res) {
          // 自定义数据,返回的是一个key-value数组
          if (Array.isArray(res)) {
            setOptionList(res);
            // 从其他表单中获取数据,返回的是一个对象
          } else if (res.data) {
            const list = (res.data?.data || []).map((val: string) => ({ key: val, value: val }));
            setOptionList(list);
          }
        }
      });
    }
  }, [form, componentList, loadDataSource]);
  const changeSymbol = useCallback(() => {
    form.setFieldsValue({ value: undefined });
  }, [form]);
  const handleFinish = useCallback(() => {
    const values = form.getFieldsValue();
    if (rule.field !== values.field || rule.symbol !== values.symbol) {
      onChange && onChange(blockIndex, ruleIndex, values);
    }
  }, [form, blockIndex, ruleIndex, onChange]);
  return (
    <Form
      className={classnames(styles.form, className ? className : '')}
      form={form}
      layout="inline"
      autoComplete="off"
      style={{ marginBottom: '8px' }}
      initialValues={initValues}
      onValuesChange={handleFinish}
    >
      <Form.Item name="field">
        <Select
          placeholder="关联字段"
          className={styles.field}
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
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.field !== curValues.field}>
        {() => {
          const componentType = selectComponent && selectComponent.type;
          let symbolList: { value: string; label: string }[] = [];
          if (componentType) {
            switch (componentType) {
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
        }}
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, curValues) =>
          prevValues.symbol !== curValues.symbol || prevValues.field !== curValues.field
        }
      >
        {({ getFieldValue }) => {
          const componentType = selectComponent && selectComponent.type;
          const symbol = getFieldValue('symbol');
          if (symbol === 'null' || symbol === 'notNull') {
            return null;
          }
          // 文本类型
          if (componentType === 'Input' || componentType === 'Textarea') {
            // 输入单个值
            if (symbol === 'equal' || symbol === 'unequal' || symbol === 'include' || symbol === 'exclude') {
              return (
                <Form.Item name="value" className={styles.valueWrapper}>
                  <Input placeholder="输入值" className={styles.value} />
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
            return (
              <Form.Item name="value" className={styles.valueWrapper}>
                <InputNumber placeholder="输入值" className={styles.value} />
              </Form.Item>
            );
          }
          // 日期类型
          if (componentType === 'Date') {
            // 动态筛选
            if (symbol === 'dynamic') {
              return (
                <Form.Item name="value" className={styles.valueWrapper}>
                  <Select placeholder="请选择" className={styles.value}>
                    <Option value="today">今天</Option>
                    <Option value="nextYear">明年</Option>
                  </Select>
                </Form.Item>
              );
            }
            const format = selectComponent && selectComponent.format;
            const showTime = format === 'YYYY-MM-DD HH:mm:ss' ? { showTime: true } : {};
            if (symbol === 'range') {
              return (
                <Form.Item name="value" className={styles.valueWrapper}>
                  <RangePicker {...showTime} format={format} className={styles.value} />
                </Form.Item>
              );
            }
            return (
              <Form.Item name="value" className={styles.valueWrapper}>
                <DatePicker {...showTime} format={format} className={styles.value} />
              </Form.Item>
            );
          }
          // 选项类型(下拉,单选,多选)
          if (componentType === 'Select' || componentType === 'Radio' || componentType === 'Checkbox') {
            if (symbol === 'include' || symbol === 'exclude') {
              return (
                <Form.Item name="value" className={styles.valueWrapper}>
                  <Input placeholder="输入值" className={styles.value} />
                </Form.Item>
              );
            }
            if (symbol === 'equal' || symbol === 'unequal') {
              return (
                <Form.Item name="value" className={styles.valueWrapper}>
                  <Select placeholder="请选择" className={styles.value} suffixIcon={<Icon type="xiala" />}>
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
                    className={styles.value}
                    mode="multiple"
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
          }
          return null;
        }}
      </Form.Item>
    </Form>
  );
};

export default memo(RuleForm);
