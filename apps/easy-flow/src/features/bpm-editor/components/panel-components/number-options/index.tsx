import {memo, useState} from "react";
import styles from "@/features/bpm-editor/components/panel-components/select-option-list/index.module.scss";
import {Icon} from "@common/components";
import {Input, Select} from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {NumberDefaultOption} from "@type";

interface NumberOptionProps {
  id?: string,
  values?: { [key: string]: any },
  onChange?: (v: NumberDefaultOption) => void
}

const {Option} = Select
const defaultOptions = [
  {key: 'custom', value: '自定义'},
  {key: 'calculate', value: '公式计算'},
]

const NumberOption = (props: NumberOptionProps) => {

  const {id, values, onChange} = props
  const [type, setType] = useState<string>(values?.type)
  // 默认值类型选择
  const handleChange = useMemoCallback((value: string) => {
    setType(value)
  })
  const handleInputBlur = useMemoCallback((e) => {
    const value: string = e.target.value
    onChange && onChange({id, type, customData: value})
  })

  const renderContent = useMemoCallback(() => {

    if (type === 'custom') {
      return (
        <div className="custom_select">
          <Input size="large" defaultValue={''} onBlur={handleInputBlur}/>
        </div>
      )

    } else {

    }
  })
  return (
    <>
      <Select
        placeholder="请选择"
        className={styles.dict_content}
        size="large"
        suffixIcon={<Icon type="xiala"/>}
        value={type}
        onChange={handleChange}
      >
        {defaultOptions.map(({key, value}) => (
          <Option value={key} key={key}>
            {value}
          </Option>
        ))}
      </Select>
      {renderContent()}
    </>
  )
}

export default memo(NumberOption)