import React, { Fragment, memo, useEffect } from 'react';
import styles from '@/features/bpm-editor/components/panel-components/serial-rules/index.module.scss';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Button, Dropdown, Form, Input, Menu } from 'antd';
import DraggableOption from '@/features/bpm-editor/components/panel-components/serial-rules/drag-options';
import { Icon } from '@common/components';
import { RuleOption } from '@type';
import { getFieldValue } from '@utils';
import { useAppSelector } from '@app/hooks';
import { errorSelector } from '@/features/bpm-editor/form-design/formzone-reducer';

const { SubMenu } = Menu;
const labelCol = { span: 24 };

interface RuleComponentProps {
  fields: { id: string; name: string }[];
  type: string;
  onChange?: (v: any) => void;
  rules: RuleOption[];
  ruleName: string;
  ruleStatus?: number;
  editStatus?: boolean;
  form?: any;
  isError?: any;
  id: string;
  serialId?: string;
}

const RuleComponent = (props: RuleComponentProps) => {
  const { onChange, type, editStatus, isError, ruleStatus, rules, ruleName, form, fields, id } = props;
  const errors = useAppSelector(errorSelector);

  const handleAdd = useMemoCallback((addItem) => {
    const { key, keyPath } = addItem;
    const list = [...rules];
    let ruleItem: RuleOption;
    if (keyPath.length > 1) {
      const type: 'fixedChars' = keyPath.find((item: any) => item !== key);
      ruleItem = getFieldValue({ key: type, fieldValue: key });
    } else {
      ruleItem = getFieldValue({ key });
    }
    list?.push(ruleItem);
    onChange && onChange({ type, ruleName, rules: list });
  });

  // 添加规则下拉
  const menu = useMemoCallback(() => {
    const disabledMenu = rules.findIndex((item) => item.type === 'createTime') !== -1;
    // const children = fields.map((item) => <Menu.Item key={item.id}>{item.name}</Menu.Item>);
    return (
      <Menu onClick={handleAdd}>
        <Menu.Item key="createTime" disabled={disabledMenu}>
          提交日期
        </Menu.Item>
        <Menu.Item key="fixedChars">固定字符</Menu.Item>
        {/*<SubMenu title="表单字段" key="fieldName">*/}
        {/*  {children}*/}
        {/*</SubMenu>*/}
      </Menu>
    );
  });
  const handleDrag = useMemoCallback((sourceIndex: number, targetIndex: number) => {
    const list: RuleOption[] = [...rules];
    let tmp = list[sourceIndex];
    list[sourceIndex] = list[targetIndex];
    list[targetIndex] = tmp;
    onChange && onChange({ type, ruleName, rules: list });
  });

  const handleChangeRule = useMemoCallback((ruleData) => {
    let list: RuleOption[] = [...rules];
    if (ruleData.type === 'fixedChars') {
      const { index, chars } = ruleData;
      list[index] = {
        type: 'fixedChars',
        chars: chars,
      };
    } else if (ruleData.type === 'createTime') {
      const { index, format } = ruleData;
      list[index] = {
        type: 'createTime',
        format,
      };
    } else if (ruleData.type === 'fieldName') {
      const { index, fieldValue } = ruleData;
      list[index] = {
        type: 'fieldName',
        fieldValue,
      };
    } else {
      list = list?.map((item) => {
        if (item.type === ruleData.type) {
          item = { ...ruleData };
        }
        return item;
      });
    }
    onChange && onChange({ type, ruleName, rules: list });
  });

  const handleDelete = useMemoCallback((index) => {
    const list: RuleOption[] = [...rules];
    list.splice(index, 1);
    onChange && onChange({ type, ruleName, rules: list });
  });

  const handleChangeName = useMemoCallback((e) => {
    const name = e.target.value;
    onChange && onChange({ type, ruleName: name, rules });
  });

  useEffect(() => {
    const isError = errors.find((item) => item.id === id);
    if (isError && isError.content?.includes('SerialError')) {
      form.validateFields([['name']]);
    }
  }, [errors, id, form]);

  return (
    <>
      <Form component="div" form={form} initialValues={{ name: ruleName }}>
        <Fragment>
          <Form.Item
            name="name"
            label="规则名称"
            labelCol={labelCol}
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error('请输入规则名称'));
                  }
                  if (!/^[\u4E00-\u9FA5a-zA-Z0-9_]{1,30}$/.test(value)) {
                    return Promise.reject(new Error('请输入1-30位的汉字、字母、数字、下划线'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              size="large"
              placeholder="请输入"
              onChange={handleChangeName}
              disabled={type === 'inject' && editStatus}
            />
          </Form.Item>
          <Form.Item className={styles.formWrapper} name="rules" label="规则配置" labelCol={labelCol}>
            <div className={styles.custom_list}>
              {rules?.map((item, index: number) => (
                <Fragment key={index}>
                  <DraggableOption
                    index={index}
                    key={index}
                    data={item}
                    fields={fields}
                    onChange={handleChangeRule}
                    onDrag={handleDrag}
                    onDelete={handleDelete}
                    disabled={type === 'inject' && (editStatus || ruleStatus === 1)}
                  />
                </Fragment>
              ))}
            </div>
          </Form.Item>
        </Fragment>
      </Form>
      {isError && <span className={styles.errorTips}>请输入编号规则固定字符</span>}
      {!(type === 'inject' && (editStatus || ruleStatus === 1)) && (
        <Dropdown overlay={menu}>
          <Button className={styles.add_custom} size="large">
            <Icon className={styles.iconfont} type="xinzengjiacu" />
            <span>添加</span>
          </Button>
        </Dropdown>
      )}
    </>
  );
};

export default memo(RuleComponent);
