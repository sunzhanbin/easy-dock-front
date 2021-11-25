import React, { Fragment, memo, useEffect } from 'react';
import styles from '@/features/bpm-editor/components/panel-components/serial-rules/index.module.scss';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Button, Dropdown, Form, Input, Menu } from 'antd';
import DraggableOption from '@/features/bpm-editor/components/panel-components/serial-rules/drag-options';
import { Icon } from '@common/components';
import { RuleOption } from '@type';
import { getFieldValue } from '@utils';

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
  serialId?: string;
}

const RuleComponent = (props: RuleComponentProps) => {
  const { onChange, type, editStatus, ruleStatus, rules, ruleName, form, fields } = props;
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
    const children = fields.map((item) => <Menu.Item key={item.id}>{item.name}</Menu.Item>);
    return (
      <Menu onClick={handleAdd}>
        <Menu.Item key="createTime" disabled={disabledMenu}>
          提交日期
        </Menu.Item>
        <Menu.Item key="fixedChars">固定字符</Menu.Item>
        <SubMenu title="表单字段" key="fieldName">
          {children}
        </SubMenu>
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
    // console.log(form, 'ffff')
    return () => {
      
    };
  }, [form]);
  
  return (
    <Form component="div" form={form} initialValues={{ name: ruleName }}>
      <Fragment>
        <Form.Item
          name="name"
          label="规则名称"
          labelCol={labelCol}
          rules={[{ required: true, message: '请输入规则名称!' }]}
        >
          <Input size="large" onChange={handleChangeName} disabled={type === 'inject' && editStatus} />
        </Form.Item>
        <Form.Item className={styles.form} name="rules" label="规则配置" labelCol={labelCol}>
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
            {!(type === 'inject' && (editStatus || ruleStatus === 1)) && (
              <Dropdown overlay={menu}>
                <Button className={styles.add_custom} size="large">
                  <Icon className={styles.iconfont} type="xinzengjiacu" />
                  <span>添加</span>
                </Button>
              </Dropdown>
            )}
          </div>
        </Form.Item>
      </Fragment>
    </Form>
  );
};

export default memo(RuleComponent);
