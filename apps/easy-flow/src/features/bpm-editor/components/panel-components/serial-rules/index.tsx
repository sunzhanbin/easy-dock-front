import {Fragment, memo, useState} from 'react'
import {Button, Form, Radio} from 'antd'
import {serialRulesItem} from "@type";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "./index.module.scss";
import DraggableOption from "./drag-options";
import {Icon} from "@common/components";

interface RulesProps {
  id: string;
  value?: serialRulesItem;
  onChange?: (v: serialRulesItem) => void;
}

const SerialRules = (props: RulesProps) => {
  const {id, value, onChange} = props
  const [type, setType] = useState<string>(value?.type || 'custom')
  const [rules, setRules] = useState<serialRulesItem['rules']>(value?.rules)

  const handleRadioChange = useMemoCallback((type) => {
    setType(type)
    onChange && onChange({id, type})
  })

  const handleAdd = useMemoCallback(() => {

  })

  const handleDrag = useMemoCallback(() => {

  })

  const handleChangeRule = useMemoCallback(() => {

  })

  const handleDelete = useMemoCallback(() => {

  })


  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      console.log(rules, 'rules')
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
                <Button className={styles.add_custom} onClick={handleAdd}>
                  <Icon className={styles.iconfont} type="xinzengjiacu"/>
                  <span>添加</span>
                </Button>
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