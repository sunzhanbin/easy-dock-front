import { memo, useEffect, useMemo, useState } from 'react';
import { Button, Form, Select, Radio, Input, Tooltip, Space } from 'antd';
import classNames from 'classnames';
import { Icon } from '@common/components';
import { TriggerConfig } from '@/type/flow';
import { builderAxios } from '@utils';
import styles from './index.module.scss';
import Mapping from './mapping';
import { useSubAppDetail } from '@/app/app';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { FormInstance } from 'rc-field-form';
import { useAppSelector } from '@/app/hooks';
import { formMetaSelector } from '../../flow-design/flow-slice';

const { Option } = Select;

export interface TriggerProps {
  name: string | string[];
  value?: TriggerConfig[];
  onChange?: (val: this['value']) => void;
}

interface Process {
  id: number;
  name: string;
  type?: number;
  version: { id: number };
}

const TriggerProcessConfig = (props: TriggerProps) => {
  const { name, value } = props;
  const formMeta = useAppSelector(formMetaSelector);
  const [processList, setProcessList] = useState<Process[]>([]);
  const subAppDetail = useSubAppDetail();
  const currentSubAppId = useMemo(() => {
    return subAppDetail.data?.id;
  }, [subAppDetail]);
  const appId = useMemo(() => {
    return subAppDetail.data?.app.id;
  }, [subAppDetail]);

  const members = useMemo(() => {
    return Object.values(formMeta?.components || {})
      .map((v) => v.config)
      .filter((v) => v.type === 'Member')
      .map((v) => ({ id: v.id, label: v.label, fieldName: v.fieldName }));
  }, [formMeta]);

  const handleChangeProcess = useMemoCallback((e, form: FormInstance, index: number, name: string | string[]) => {
    const targetProcess = processList.find((v) => v.id === e);
    const processName = targetProcess?.name;
    const triggerConfig = form.getFieldValue(name);
    const newConfig = { ...triggerConfig[index], name: processName, mapping: [] };
    triggerConfig.splice(index, 1, newConfig);
  });

  useEffect(() => {
    if (appId) {
      builderAxios.get<{ data: Process[] }>(`/subapp/${appId}/list/all/deployed`).then((res) => {
        const list = res.data
          .filter((v) => v.type === 2 && v.id !== currentSubAppId)
          .map((v) => ({ id: v.id, name: v.name, version: v.version }));
        setProcessList(list);
      });
    }
  }, [currentSubAppId, appId, value]);

  return (
    <div className={styles.container}>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return (
            <Form.List name={name}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field, index) => {
                      return (
                        <div className={styles['process-item']} key={field.name}>
                          <Tooltip title="删除触发流程" placement="left">
                            <div
                              className={classNames(
                                styles['delete-process'],
                                fields.length <= 1 ? styles.disabled : '',
                              )}
                              onClick={() => {
                                if (fields.length <= 1) {
                                  return;
                                }
                                remove(index);
                              }}
                            >
                              <Icon type="shanchu" className={styles.icon} />
                            </div>
                          </Tooltip>
                          <Form.Item
                            required
                            label="选择要被触发的流程"
                            name={[field.name, 'id']}
                            className={styles.process}
                            rules={[{ required: true, message: '请选择要被触发的流程!' }]}
                          >
                            <Select
                              placeholder="请选择"
                              size="large"
                              virtual={false}
                              className={styles['process-select']}
                              suffixIcon={<Icon type="xiala" />}
                              getPopupContainer={(node) => node}
                              onChange={(e) => handleChangeProcess(e, form, index, name)}
                            >
                              {processList.map(({ id, name }) => (
                                <Option key={id} value={id}>
                                  {name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item name={[field.name, 'name']} noStyle>
                            <Input type="hidden" />
                          </Form.Item>
                          <Form.Item
                            label="发起人设置"
                            name={[field.name, 'starter', 'type']}
                            style={{ marginBottom: '8px' }}
                          >
                            <Radio.Group>
                              <Space direction="vertical" className={styles.space}>
                                <Radio value={1}>当前流程发起人</Radio>
                                <Radio value={2}>系统发起</Radio>
                                <Radio value={3}>表单人员控件</Radio>
                              </Space>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate>
                            {(form) => {
                              const nameList = Array.isArray(name) ? [...name] : [name];
                              const type = form.getFieldValue([...nameList, field.name, 'starter', 'type']);
                              if (type === 3) {
                                return (
                                  <Form.Item
                                    name={[field.name, 'starter', 'value']}
                                    rules={[{ required: true, message: '请选择表单中的人员控件!' }]}
                                  >
                                    <Select
                                      placeholder="请选择"
                                      size="large"
                                      virtual={false}
                                      className={styles['type-select']}
                                      suffixIcon={<Icon type="xiala" />}
                                      getPopupContainer={(node) => node}
                                    >
                                      {members.map((m) => (
                                        <Option key={m.id} value={m.fieldName}>
                                          {m.label}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                );
                              }
                              return null;
                            }}
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate>
                            {(form) => {
                              const nameList = Array.isArray(name) ? [...name] : [name];
                              const subAppId = form.getFieldValue([...nameList, field.name, 'id']);
                              return (
                                <Form.Item
                                  label="字段对应关系设置"
                                  name={[field.name, 'mapping']}
                                  className={styles['mapping-wrap']}
                                >
                                  <Mapping name={[field.name, 'mapping']} parentName={nameList} subAppId={subAppId} />
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                        </div>
                      );
                    })}
                    <Button
                      className={styles['add-process']}
                      size="large"
                      icon={<Icon type="xinzeng" />}
                      onClick={() => add({ starter: { type: 1 } })}
                    >
                      触发流程
                    </Button>
                  </>
                );
              }}
            </Form.List>
          );
        }}
      </Form.Item>
    </div>
  );
};

export default memo(TriggerProcessConfig);
