import { memo, useEffect, useState, useMemo } from 'react';
import { Button, Form, Select, Tooltip } from 'antd';
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
      <div className={styles.content}>
        <Form.List name={[...name]}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, index) => {
                  return (
                    <div className={styles.item} key={index}>
                      <Form.Item
                        name={[field.name, 'current']}
                        className={styles.current}
                        rules={[{ required: true, message: '请选择当前流程字段' }]}
                      >
                        <Select size="large" placeholder="当前流程">
                          {currentComponents.map((v) => {
                            return (
                              <Option key={v.id} value={v.fieldName}>
                                {v.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <div className={styles.symbol}> 对应 </div>
                      <Form.Item
                        name={[field.name, 'target']}
                        className={styles.target}
                        rules={[{ required: true, message: '请选择所选流程字段' }]}
                      >
                        <Select size="large" placeholder="所选流程">
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
                        <Tooltip title="删除对应字段" placement="left">
                          <span>
                            <Icon type="shanchu" className={styles.icon} />
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
                <Button icon={<Icon type="xinzeng" />} className={styles['add-field']} onClick={() => add()}>
                  对应字段
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
