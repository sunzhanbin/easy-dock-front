import { memo, useState, useRef, useEffect, useMemo } from 'react';
import { Form, Input, FormInstance, Tooltip, Popconfirm } from 'antd';
import classNames from 'classnames';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';
import { CompConfig } from '@/type';
import FormList from './form-list';
import { FieldAuthsMap } from '@/type/flow';
import { omit } from 'lodash';
import PubSub from 'pubsub-js';

interface TabProps {
  fieldName: string;
  auth: FieldAuthsMap;
  projectId: number;
  disabled?: boolean;
  formInstance?: FormInstance;
  components?: CompConfig[];
  readonly?: boolean;
  value?: any;
  onChange?: (value: this['value']) => void;
}

const Tabs = ({ components = [], fieldName, auth, projectId, disabled, formInstance, readonly }: TabProps) => {
  const [form] = Form.useForm();
  const tabRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<number>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [popVisible, setPopVisible] = useState<boolean>(false);
  // 编辑态默认有个tab,用于展示编辑的控件
  useEffect(() => {
    const el = document.getElementById('edit-form');
    if (el?.contains(tabRef.current)) {
      setIsEdit(true);
      setActiveKey(-1);
    } else {
      setIsEdit(false);
      setActiveKey(0);
    }
  }, [tabRef]);

  const handleAdd = useMemoCallback((add: (defaultValue?: any) => void, length: number, __title__: string) => {
    if (disabled) {
      return;
    }
    add();
    setActiveKey(length);
    const tabValue = (formInstance?.getFieldValue(fieldName) || []).filter((v: any) => v && v?.__title__);
    if (length === 0) {
      const defaultValue = formInstance?.getFieldValue(fieldName)?.[0];
      if (defaultValue && typeof defaultValue === 'object' && Object.keys(defaultValue).length) {
        tabValue.push({ __title__, ...defaultValue });
      } else {
        tabValue.push({ __title__ });
      }
    } else {
      tabValue.push({ __title__ });
    }
    formInstance?.setFieldsValue({ [fieldName]: tabValue });
  });

  const handleRemove = useMemoCallback((remove: (index: number) => void, index: number, event: MouseEvent) => {
    event.stopPropagation();
    if (disabled) {
      return;
    }
    const tabsValue = formInstance?.getFieldValue(fieldName);
    if (tabsValue && tabsValue?.[index]) {
      // 删除tab时要更新关联的数字公示计算
      const subComponentNames = Object.keys(omit(tabsValue[index], ['__title__']));
      subComponentNames.forEach((key) => {
        PubSub.publish(`${fieldName}.${key}-change`, undefined);
      });
    }
    remove(index);
    if (activeKey !== undefined) {
      let newKey = activeKey;
      if (index < activeKey) {
        newKey = activeKey - 1;
      } else if (index === activeKey) {
        newKey = activeKey < 1 ? 0 : activeKey - 1;
      }
      setActiveKey(newKey);
    }
  });

  const content = useMemo(() => {
    return (
      <Form form={form} autoComplete="off">
        <Form.Item label="标题" name="__title__" required rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    );
  }, []);

  const handleConfirm = useMemoCallback((add: (defaultValue?: any) => void, length: number) => {
    form
      .validateFields()
      .then((values) => {
        const { __title__ } = values;
        handleAdd(add, length, __title__);
        form.resetFields();
        setPopVisible(false);
      })
      .catch(() => {
        setPopVisible(true);
      });
  });

  const handleShowPopup = useMemoCallback(() => {
    if (disabled) {
      return;
    }
    setPopVisible(true);
  });

  return (
    <div className={classNames(styles.tabs, disabled ? styles.disabled : '', isEdit ? styles.edit : '')} ref={tabRef}>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          const fieldValue = form.getFieldValue(fieldName);
          return (
            <Form.List name={fieldName}>
              {(fields, { add, remove }) => {
                return (
                  <div className={styles.container}>
                    <div className={classNames(styles.title)}>
                      {isEdit ? (
                        <div className={classNames(styles.item, styles.active)}>
                          <div className={styles.name}>Edit</div>
                        </div>
                      ) : (
                        fields.map((field, index) => {
                          return (
                            <div
                              key={field.key}
                              className={classNames(styles.item, activeKey === field.name ? styles.active : '')}
                              onClick={() => {
                                setActiveKey(field.name), console.info(formInstance?.getFieldValue(fieldName));
                              }}
                            >
                              <div className={styles.name}>{fieldValue?.[index]?.['__title__']}</div>
                              <div className={styles.operation}>
                                <div
                                  className={styles.delete}
                                  onClick={(event) => handleRemove(remove, index, event as any)}
                                >
                                  <Tooltip title="删除">
                                    <span>
                                      <Icon type="shanchu" className={styles.icon} />
                                    </span>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <Popconfirm
                        placement="bottomLeft"
                        icon={null}
                        title={content}
                        visible={popVisible}
                        onConfirm={() => handleConfirm(add, fields.length)}
                        onCancel={() => setPopVisible(false)}
                      >
                        <div className={styles.add} onClick={handleShowPopup}>
                          <Icon type="xinzeng" className={styles.icon} />
                        </div>
                      </Popconfirm>
                    </div>
                    <div className={styles.content}>
                      {(fields.length > 0 || isEdit) && (
                        <FormList
                          fields={components}
                          id={String(activeKey)}
                          parentId={fieldName}
                          auth={auth}
                          readonly={readonly}
                          projectId={projectId}
                          name={activeKey!}
                        />
                      )}
                    </div>
                  </div>
                );
              }}
            </Form.List>
          );
        }}
      </Form.Item>
    </div>
  );
};

export default memo(Tabs);
