import React, { Fragment, memo, useMemo, useEffect, useState } from 'react';
import styles from '@/features/bpm-editor/components/panel-components/serial-rules/index.module.scss';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Button, Dropdown, Form, Input, Menu } from 'antd';
import DraggableOption from '@/features/bpm-editor/components/panel-components/serial-rules/drag-options';
import { Icon } from '@common/components';
import { FormField, RuleOption, serialRulesItem } from '@type';
import { saveSerialRules } from '@apis/form';
import { getFieldValue } from '@utils';
import { useSubAppDetail } from '@app/app';
import { useAppSelector } from '@app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';

const { SubMenu } = Menu;
const labelCol = { span: 24 };

interface RuleComponentProps {
  id: string;
  type: string;
  onChange?: (v: serialRulesItem) => void;
  handleTypeChange?: (v: string) => void;
  rules: RuleOption[];
  setRules: (v: any) => void;
  ruleName: string;
  setRuleName: (v: any) => void;
  ruleStatus?: number;
  editStatus?: boolean;
  form?: any;
  serialId?: number;
}

const RuleComponent = (props: RuleComponentProps) => {
  const { id, onChange, type, handleTypeChange, serialId, rules, setRules, ruleName, setRuleName, form } = props;
  const byId = useAppSelector(componentPropsSelector);
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
    setRules(list);
    onChange &&
      onChange({
        serialId,
        serialMata: {
          type,
          ruleName,
          rules: list,
        },
      });
  });

  const fields = useMemo<{ id: string; name: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => com.type !== 'Tabs' && com.id !== id)
      .map((com) => ({
        id: com.fieldName,
        name: com.label,
      }));
  }, [byId, id]);

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
    setRules(list);
    onChange &&
      onChange({
        serialId,
        serialMata: {
          type,
          ruleName,
          rules: list,
        },
      });
  });

  const handleChangeRule = useMemoCallback((ruleData) => {
    let list: RuleOption[] = [...rules];
    if (ruleData.type === 'fixedChars') {
      const { index, chars } = ruleData;
      list[index] = {
        type: 'fixedChars',
        chars: chars,
      };
    }
    if (ruleData.type === 'createTime') {
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
    setRules(list);
    onChange &&
      onChange({
        serialId,
        serialMata: {
          type,
          ruleName,
          rules: list,
        },
      });
  });

  const handleDelete = useMemoCallback((index) => {
    const list: RuleOption[] = [...rules];
    list.splice(index, 1);
    setRules(list);
    onChange &&
      onChange({
        serialId,
        serialMata: {
          type,
          ruleName,
          rules: list,
        },
      });
  });

  const handleChangeName = useMemoCallback((e) => {
    setRuleName(e.target.value);
    onChange &&
      onChange({
        serialId,
        serialMata: {
          type,
          ruleName,
          rules,
        },
      });
  });

  useEffect(() => {
    console.log(rules, ruleName);
  }, [rules, ruleName]);

  return (
    <Form component="div" form={form}>
      <Fragment>
        <Form.Item
          name="name"
          label="规则名称"
          labelCol={labelCol}
          rules={[{ required: true, message: '请输入规则名称!' }]}
        >
          <Input size="large" value={ruleName} onChange={handleChangeName} />
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
                />
              </Fragment>
            ))}
            <Dropdown overlay={menu}>
              <Button className={styles.add_custom} size="large">
                <Icon className={styles.iconfont} type="xinzengjiacu" />
                <span>添加</span>
              </Button>
            </Dropdown>
          </div>
        </Form.Item>
      </Fragment>
    </Form>
  );
};

export default memo(RuleComponent);
