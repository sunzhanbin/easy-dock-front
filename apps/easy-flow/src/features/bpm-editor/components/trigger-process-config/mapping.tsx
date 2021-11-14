import { memo, useEffect, useState, useMemo } from 'react';
import { Button, Form, Select, Tooltip } from 'antd';
import classNames from 'classnames';
import { builderAxios } from '@utils';
import styles from './index.module.scss';
import { Icon } from '@common/components';
import { useAppSelector } from '@/app/hooks';
import { formMetaSelector } from '../../flow-design/flow-slice';
import { AutoSelector } from '../data-api-config/components/map';
import { AuthType, FieldAuth } from '@/type/flow';

const { Option } = Select;

interface MappingProps {
  name: [number, string];
  parentName: string[];
  subAppId?: number;
  currentFields?: any;
  targetFields?: any;
  value?: any;
  onChange?: (val: this['value']) => void;
}
interface Component {
  name: string;
  field: string;
  auth: AuthType | null;
}

const Mapping = ({ name, parentName, subAppId, onChange }: MappingProps) => {
  const formMeta = useAppSelector(formMetaSelector);
  const [targetComponents, setTargetComponents] = useState<Component[]>([]);
  const currentComponents = useMemo(() => {
    return Object.values(formMeta?.components || {})
      .map((v) => v.config)
      .filter((v) => !['Tabs', 'FlowData'].includes(v.type))
      .map((v) => ({ id: `\${${v.fieldName}}`, name: v.label as string }));
  }, [formMeta]);
  useEffect(() => {
    if (subAppId) {
      builderAxios.get<{ data: FieldAuth[] }>(`/process/list/fields/${subAppId}`).then((res) => {
        const components = res.data.filter((v) => !['Tabs', 'FlowData', 'SerialNum'].includes(v.type));
        const requiredList = components.filter((v) => v.auth === AuthType.Required);
        const requiredConfig = requiredList.map((v) => ({ target: v.name, required: true }));
        const options = components.filter((v) => v.auth !== AuthType.Required);
        if (requiredConfig.length) {
          onChange && onChange(requiredConfig);
        }
        setTargetComponents(options);
      });
    }
  }, [subAppId]);
  return (
    <div className={styles.mapping}>
      <div className={styles.header}>
        <div className={styles.target}>所选流程</div>
        <div className={styles.symbol}></div>
        <div className={styles.current}>当前流程</div>
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
                      <Form.Item noStyle shouldUpdate>
                        {(form) => {
                          const mapping = form.getFieldValue([...parentName, ...name, field.name]) || {};
                          return (
                            <>
                              <Form.Item
                                name={[field.name, 'target']}
                                className={styles.target}
                                rules={[{ required: true, message: '请选择' }]}
                              >
                                <Select
                                  size="large"
                                  placeholder="所选流程"
                                  getPopupContainer={(c) => c}
                                  disabled={mapping.required}
                                >
                                  {targetComponents.map((v) => {
                                    return (
                                      <Option key={v.field} value={v.field}>
                                        {v.name}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                              <div className={styles.symbol}> 对应 </div>
                              <Form.Item
                                name={[field.name, 'current']}
                                className={styles.current}
                                rules={[{ required: true, message: '请输入' }]}
                              >
                                <AutoSelector options={currentComponents} />
                              </Form.Item>
                              <div
                                className={styles.delete}
                                onClick={() => {
                                  if (mapping.required) {
                                    return;
                                  }
                                  remove(index);
                                }}
                              >
                                <Tooltip title="删除对应字段" placement="left">
                                  <span>
                                    <Icon
                                      type="shanchu"
                                      className={classNames(styles.icon, mapping.required ? styles.disabled : '')}
                                    />
                                  </span>
                                </Tooltip>
                              </div>
                            </>
                          );
                        }}
                      </Form.Item>
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
