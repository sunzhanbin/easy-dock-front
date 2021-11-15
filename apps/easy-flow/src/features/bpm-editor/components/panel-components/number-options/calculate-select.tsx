import { memo, useMemo, useEffect } from 'react';
import { message, Select } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useAppSelector } from '@app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { FormField } from '@type';
import styles from './index.module.scss';
import { Icon } from '@common/components';

const { Option } = Select;

interface CalculateProps {
  calcType?: string;
  calculateData?: any;
  id?: string;
  onChange?: (value: string | string[]) => void;
}

const CalculateSelect = (props: CalculateProps) => {
  const { calcType, id, onChange, calculateData } = props;
  const byId = useAppSelector(componentPropsSelector);
  // 公式计算加减法筛选过滤
  const fieldMulti = useMemo<
    {
      type: string;
      id: string;
      name: string;
      format?: string;
    }[]
  >(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => {
        if (calcType === 'add') {
          return com.type === 'InputNumber' && com.id !== id;
        } else if (calcType === 'minus') {
          return (com.type === 'InputNumber' || com.type === 'Date') && com.id !== id;
        }
      })
      .map((com) => ({
        id: com.fieldName,
        name: com.label,
        type: com.type,
        format: com.type === 'Date' ? com.format : '',
      }));
  }, [byId, id]);

  // 除加减法筛选计算
  const field = useMemo(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => com.type === 'Tabs' && com.id !== id)
      .map((com) => {
        if (com.type === 'Tabs' && com.components) {
          return com.components.map((item) => {
            const { config } = item;
            return (
              config.type === 'InputNumber' && {
                id: config.parentId,
                subId: config.id,
                name: `${com.label}.${config.label}`,
              }
            );
          });
        }
      })
      .flat(2)
      .filter((item) => !!item);
  }, [byId, id]);

  // 处理加减法多选联动
  const handleDisableFields = useMemoCallback((field): boolean => {
    const prevField = fieldMulti.find((item) => calculateData?.includes(item.id));
    if (!prevField) {
      return false;
    } else if (prevField?.type === field.type) {
      let status = false;
      if (field.type === 'Date') {
        if (prevField.format === field.format) {
          return false;
        }
        status = true;
      }
      return status;
    }
    return true;
  });

  // 加减法tips展示
  const filterMultiFields = useMemo(() => {
    if (!Array.isArray(calculateData) || !calculateData.length) return [];
    return calculateData
      ?.map((item: string) => {
        const field = fieldMulti.find((field) => field.id === item);
        return field?.name;
      })
      .filter((item: string | undefined) => !!item);
  }, [calculateData]);

  // 多选下拉
  const handleMultiChange = useMemoCallback((values) => {
    if (values.length > 2 && values.find((item: string) => item.includes('Date'))) {
      return message.warning('最多支持选择2个日期控件 !');
    }
    onChange && onChange(values);
  });

  // 单选下拉
  const handleChangeField = useMemoCallback((values) => {
    onChange && onChange(values);
  });
  return (
    <>
      {calcType === 'add' || calcType === 'minus' ? (
        <>
          <Select
            mode="multiple"
            placeholder="请选择"
            size="large"
            onChange={handleMultiChange}
            value={calculateData}
            style={{ width: '100%' }}
            maxTagCount={'responsive' as const}
          >
            {fieldMulti.map((item) => (
              <Option key={item.id} value={item.id} disabled={handleDisableFields(item)}>
                {item.name}
              </Option>
            ))}
          </Select>
          <span className={styles.text_tips}>{filterMultiFields?.join(`${calcType === 'add' ? ' + ' : ' - '}`)}</span>
        </>
      ) : (
        <>
          <Select
            placeholder="请选择"
            className={styles.dict_content}
            size="large"
            suffixIcon={<Icon type="xiala" />}
            value={calculateData}
            onChange={handleChangeField}
          >
            {field.map((item: any) => (
              <Option value={`${item.id}.${item.subId}`} key={item.subId}>
                {item.name}
              </Option>
            ))}
          </Select>
        </>
      )}
    </>
  );
};

export default memo(CalculateSelect);
