import { memo, useEffect, useMemo, useState } from 'react';
import { Button, Form, Select, Radio, Input } from 'antd';
import { Icon } from '@common/components';
import { TriggerConfig } from '@/type/flow';
import { builderAxios } from '@utils';
import styles from './index.module.scss';
import Mapping from './mapping';
import { useSubAppDetail } from '@/app/app';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { FormInstance } from 'rc-field-form';

const { Option } = Select;

export interface TriggerProps {
  name: string;
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

  const handleChangeProcess = useMemoCallback((e, form: FormInstance, index: number, name: string) => {
    const targetProcess = processList.find((v) => v.id === e);
    const versionId = targetProcess?.version.id;
    const processName = targetProcess?.name;
    const triggerConfig = form.getFieldValue(name);
    const newConfig = { ...triggerConfig[index], processName, mapping: [] };
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
          const versionIdList = value.map(({ processId }) => {
            const process = list.find((v) => v.id === processId);
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
                          <Form.Item
                            required
                            label="选择流程"
                            name={[field.name, 'processId']}
                            className={styles.process}
                            rules={[{ required: true, message: '请选择触发流程!' }]}
                          >
                            <Select
                              placeholder="请选择触发流程"
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
                          <Form.Item name={[field.name, 'processName']} style={{ height: 0, marginBottom: 0 }}>
                            <Input type="hidden" />
                          </Form.Item>
                          <Form.Item label="发起人设置" name={[field.name, 'starter', 'type']}>
                            <Radio.Group>
                              <Radio value={1}>当前流程发起人</Radio>
                              <Radio value={2}>系统发起</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item label="数据关系对应设置" name={[field.name, 'mapping']}>
                            <Mapping
                              name={[field.name, 'mapping']}
                              targetVersionId={targetVersionId || versionIdList[index]}
                            />
                          </Form.Item>
                          <Button size="large" onClick={() => remove(index)}>
                            删除流程
                          </Button>
                        </div>
                      );
                    })}
                    <Button
                      className={styles['add-process']}
                      size="large"
                      icon={<Icon type="xinzeng" />}
                      onClick={() => add({ starter: { type: 1 } })}
                    >
                      添加流程
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
