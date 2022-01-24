import { memo, useState, useRef, useEffect, useMemo } from "react";
import { Form, Input, FormInstance, Tooltip, Popconfirm } from "antd";
import classNames from "classnames";
import { Icon, Text } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { CompConfig } from "@/type";
import { FieldAuthsMap } from "@/type/flow";
import { omit } from "lodash";
import PubSub from "pubsub-js";
import { nameRegexp } from "@/utils";
import FormList from "./form-list";
import styles from "./index.module.scss";

interface TabProps {
  fieldName: string;
  auth: FieldAuthsMap;
  projectId: number;
  disabled?: boolean;
  formInstance?: FormInstance;
  components?: CompConfig[];
  readonly?: boolean;
  value?: any;
  onChange?: (value: this["value"]) => void;
}

const Tabs = ({ components = [], fieldName, auth, projectId, disabled, formInstance, readonly }: TabProps) => {
  const [form] = Form.useForm();
  const tabRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<number>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [popVisible, setPopVisible] = useState<boolean>(false);
  // 编辑态默认有个tab,用于展示编辑的控件
  useEffect(() => {
    const el = document.getElementById("edit-form");
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
    const defaultValue = formInstance?.getFieldValue(fieldName)?.[length];
    if (defaultValue && typeof defaultValue === "object" && Object.keys(defaultValue).length) {
      tabValue.push({ __title__, ...defaultValue });
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
      const subComponentNames = Object.keys(omit(tabsValue[index], ["__title__"]));
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
    setPopVisible(false);
  });

  const content = useMemo(() => {
    return (
      <Form form={form} autoComplete="off">
        <Form.Item
          label="标题"
          name="__title__"
          required
          rules={[
            {
              validator(_, value) {
                if (!value || !value.trim()) {
                  return Promise.reject(new Error("请输入标题"));
                }
                if (!nameRegexp.test(value.trim())) {
                  return Promise.reject(new Error("请输入1-30位的汉字、字母、数字、下划线"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入" autoFocus={true} style={{ width: "250px" }} />
        </Form.Item>
      </Form>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleCancel = useMemoCallback(() => {
    form.resetFields();
    setTimeout(() => {
      setPopVisible(false);
    }, 0);
  });

  return (
    <div className={classNames(styles.tabs, disabled ? styles.disabled : "", isEdit ? styles.edit : "")} ref={tabRef}>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          const fieldValue = form.getFieldValue(fieldName);
          return (
            <Form.List name={fieldName}>
              {(fields, { add, remove }) => {
                return (
                  <div className={classNames(styles.container, "tabs-container")}>
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
                              className={classNames(
                                styles.item,
                                activeKey === field.name ? styles.active : "",
                                "tab-nav",
                              )}
                              onClick={() => setActiveKey(field.name)}
                            >
                              <div className={styles.name}>
                                <Text text={fieldValue?.[index]?.["__title__"] || ""} />
                              </div>
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
                        z-index={9999}
                        icon={null}
                        title={content}
                        visible={popVisible}
                        disabled={true}
                        destroyTooltipOnHide={true}
                        onConfirm={() => handleConfirm(add, fields.length)}
                        onCancel={() => handleCancel()}
                      >
                        <div className={styles.add} onClick={handleShowPopup}>
                          <span>
                            <Icon type="xinzeng" className={styles.icon} />
                          </span>
                        </div>
                      </Popconfirm>
                    </div>
                    <div className={styles.content}>
                      {isEdit ? (
                        <FormList
                          fields={components}
                          id={String(activeKey)}
                          parentId={fieldName}
                          auth={auth}
                          readonly={readonly}
                          projectId={projectId}
                          name={activeKey!}
                          key={activeKey}
                        />
                      ) : (
                        fields.map((field) => {
                          return (
                            <div key={field.name} style={{ display: field.name === activeKey ? "block" : "none" }}>
                              <FormList
                                fields={components}
                                id={String(field.name)}
                                parentId={fieldName}
                                auth={auth}
                                readonly={readonly}
                                projectId={projectId}
                                name={field.name!}
                                key={field.name}
                              />
                            </div>
                          );
                        })
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
