import {Fragment, memo, useMemo, useState} from 'react'
import {Button, Form, Radio, Menu, Dropdown} from 'antd'
import {FormField, OptionItem, RuleOption, ruleType, serialRulesItem} from "@type";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "./index.module.scss";
import DraggableOption from "./drag-options";
import {Icon} from "@common/components";
import {getFieldValue} from "@utils";
import {useAppSelector} from "@app/hooks";
import {componentPropsSelector} from "@/features/bpm-editor/form-design/formzone-reducer";

interface RulesProps {
  id: string;
  value?: serialRulesItem;
  onChange?: (v: serialRulesItem) => void;
}

const {SubMenu} = Menu;

const SerialRules = (props: RulesProps) => {
  const {id, value, onChange} = props
  const [type, setType] = useState<ruleType>(value?.type || 'custom')
  const [rules, setRules] = useState<RuleOption[]>(value?.rules || [])
  const byId = useAppSelector(componentPropsSelector);

  const fields = useMemo<{ id: string; name: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => com.id !== id)
      .map((com) => ({id: com.fieldName, name: com.label}));
  }, [byId, id]);
  // 自定义规则/引用规则
  const handleRadioChange = useMemoCallback((type) => {
    setType(type)
    onChange && onChange({id, type})
  })

  // 添加规则下拉
  const menu = useMemoCallback(() => {
    const disabledMenu = rules.findIndex(item => item.type === 'createTime') !== -1
    const children = fields.map((item) => (<Menu.Item key={item.id}>{item.name}</Menu.Item>))
    return (
      <Menu onClick={handleAdd}>
        <Menu.Item key="createTime" disabled={disabledMenu}>提交日期</Menu.Item>
        <Menu.Item key="fixedChars">固定字符</Menu.Item>
        <SubMenu title="表单字段" key="fieldName">
          {children}
        </SubMenu>
      </Menu>
    )
  })
  const handleAdd = useMemoCallback((addItem) => {
    const {key, keyPath} = addItem
    const list = [...rules]
    let ruleItem: RuleOption;
    if (keyPath.length > 1) {
      const type: 'fixedChars' = keyPath.find((item: any) => item !== key)
      ruleItem = getFieldValue({key: type, fieldValue: key})
    } else {
      ruleItem = getFieldValue({key})
    }
    list?.push(ruleItem)
    setRules(list)
    onChange && onChange({id, type, rules: list})
  })

  const handleDrag = useMemoCallback((sourceIndex: number, targetIndex: number) => {
    const list: RuleOption[] = [...rules];
    let tmp = list[sourceIndex];
    list[sourceIndex] = list[targetIndex];
    list[targetIndex] = tmp;
    setRules(list);
    onChange && onChange({id, type, rules: list})
  })

  const handleChangeRule = useMemoCallback((ruleData) => {
    let list: RuleOption[] = [...rules];
    if (ruleData.type === 'fixedChars') {
      const {index, chars} = ruleData
      console.log(ruleData, 'fff')
      list[index] = {
        type: 'fixedChars',
        chars: chars
      };
    } else {
      list = list?.map(item => {
        if (item.type === ruleData.type) {
          item = {...ruleData}
        }
        return item
      })
    }

    setRules(list)
    onChange && onChange({id, type, rules: list})
  })

  const handleDelete = useMemoCallback((index) => {
    const list: RuleOption[] = [...rules];
    list.splice(index, 1);
    setRules(list);
    onChange && onChange({id, type, rules: list});
  })

  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <>
          {type &&
          <>
            <Form.Item className={styles.form} name="rules" label="">
              <div className={styles.custom_list}>
                {rules?.map((item, index: number) => (
                  <Fragment key={index}>
                    <DraggableOption
                      index={index}
                      key={index}
                      data={item}
                      onChange={handleChangeRule}
                      onDrag={handleDrag}
                      onDelete={handleDelete}
                    />
                  </Fragment>
                ))}
                <Dropdown overlay={menu}>
                  <Button className={styles.add_custom}>
                    <Icon className={styles.iconfont} type="xinzengjiacu"/>
                    <span>添加</span>
                  </Button>
                </Dropdown>
              </div>
            </Form.Item>
          </>
          }
        </>
      )
    } else if (type === 'inject') {
      return <>
        333
      </>
    }
    return null
  })
  return (
    <div>
      <Radio.Group onChange={(e) => {
        handleRadioChange(e.target.value);
      }} value={type}>
        <Radio value='custom'>自定义规则</Radio>
        <Radio value='inject'>引用规则</Radio>
      </Radio.Group>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  )
}

export default memo(SerialRules)