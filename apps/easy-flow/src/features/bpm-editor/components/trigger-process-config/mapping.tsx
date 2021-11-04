import { memo, useEffect, useState, useMemo } from 'react';
import { Button, Form, Select } from 'antd';
import { runtimeAxios } from '@utils';
import styles from './index.module.scss';
import { Icon } from '@common/components';
import { FormMeta } from '@/type/detail';
import { useAppSelector } from '@/app/hooks';
import { formMetaSelector } from '../../flow-design/flow-slice';

const { Option } = Select;

interface MappingProps {
  name: [number, string];
  targetVersionId?: number;
  currentFields?: any;
  targetFields?: any;
  value?: any;
  onChange?: (val: this['value']) => void;
}
interface Component {
  id: string;
  label: string;
  fieldName: string;
}

const Mapping = ({ name, targetVersionId }: MappingProps) => {
  const formMeta = useAppSelector(formMetaSelector);
  const [targetComponents, setTargetComponents] = useState<Component[]>([]);
  const currentComponents = useMemo(() => {
    return Object.values(formMeta?.components || {})
      .map((v) => v.config)
      .map((v) => ({ id: v.id, label: v.label, fieldName: v.fieldName }));
  }, [formMeta]);
  useEffect(() => {
    if (targetVersionId) {
      runtimeAxios.get<{ data: { meta: FormMeta } }>(`/form/version/${targetVersionId}`).then((res) => {
        const componentList = Object.values(res.data.meta.components || {})
          .map((v) => v.config)
          .map((v) => ({ id: v.id, label: v.label, fieldName: v.fieldName }));
        setTargetComponents(componentList);
      });
    }
  }, [targetVersionId]);
  return (
    <div className={styles.mapping}>
      <div className={styles.header}>
        <div className={styles.current}>当前流程</div>
        <div className={styles.symbol}> 》 </div>
        <div className={styles.target}>所选流程</div>
        <div className={styles.delete}></div>
      </div>
      <div className={styles.content}>
        <Form.List name={[...name]}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, index) => {
                  return (
                    <div className={styles.item} key={index}>
                      <Form.Item name={[field.name, 'current']} className={styles.current}>
                        <Select size="large" placeholder="请选择控件">
                          {currentComponents.map((v) => {
                            return (
                              <Option key={v.id} value={v.fieldName}>
                                {v.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <div className={styles.symbol}> 》 </div>
                      <Form.Item name={[field.name, 'target']} className={styles.target}>
                        <Select size="large" placeholder="请选择控件">
                          {targetComponents.map((v) => {
                            return (
                              <Option key={v.id} value={v.fieldName}>
                                {v.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <div className={styles.delete} onClick={() => remove(index)}>
                        <Icon type="shanchu" className={styles.icon} />
                      </div>
                    </div>
                  );
                })}
                <Button icon={<Icon type="xinzeng" />} onClick={() => add()}>
                  添加字段
                </Button>
              </>
            );
          }}
        </Form.List>
      </div>
    </div>
  );
};

export default memo(Mapping);
