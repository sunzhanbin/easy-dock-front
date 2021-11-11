import { memo, useEffect, useMemo, useState } from 'react';
import { Button, Form, Select, Radio, Input, Tooltip } from 'antd';
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
  version: { id: number };
}

const TriggerProcessConfig = (props: TriggerProps) => {
  const { name, value } = props;
  const formMeta = useAppSelector(formMetaSelector);
  const [processList, setProcessList] = useState<Process[]>([]);
  const [targetVersionId, setTargetVersionId] = useState<number>();
  const [versionIdList, setVersionList] = useState<number[]>([]);
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
    const versionId = targetProcess?.version.id;
    const processName = targetProcess?.name;
    const triggerConfig = form.getFieldValue(name);
    const newConfig = { ...triggerConfig[index], name: processName, mapping: [] };
    triggerConfig.splice(index, 1, newConfig);
    setTargetVersionId(versionId);
  });

  useEffect(() => {
    if (appId) {
      builderAxios.get<{ data: Process[] }>(`/subapp/${appId}/list/all/deployed`).then((res) => {
        const list = res.data
          .map((v) => ({ id: v.id, name: v.name, version: v.version }))
          .filter((v) => v.id !== currentSubAppId);
        if (value?.length) {
          const versionIdList = value.map(({ id }) => {
            const process = list.find((v) => v.id === id);
            return process?.version.id as number;
          });
          setVersionList(versionIdList);
        }
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
                          <Form.Item label="发起人设置" name={[field.name, 'starter', 'type']}>
                            <Radio.Group>
                              <Radio value={1}>当前流程发起人</Radio>
                              <Radio value={2}>系统发起</Radio>
                              <Radio value={3}>表单中人员控件</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate>
                            {(form) => {
                              const type = form.getFieldValue([...name, field.name, 'starter', 'type']);
                              if (type === 3) {
                                return (
                                  <Form.Item
                                    noStyle
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
                          <Form.Item
                            label="字段对应关系设置"
                            name={[field.name, 'mapping']}
                            className={styles['mapping-wrap']}
                          >
                            <Mapping
                              name={[field.name, 'mapping']}
                              targetVersionId={targetVersionId || versionIdList[index]}
                            />
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
