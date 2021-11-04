import {memo, useState} from "react";
import styles from "./index.module.scss";
import {Icon} from "@common/components";
import {InputNumber, Select} from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {NumberDefaultOption} from "@type";
import CalculateSelect from "./calculate-select";

interface NumberOptionProps {
  id?: string,
  value?: { [key: string]: any },
  onChange?: (v: NumberDefaultOption) => void,
  min?: number,
  max?: number,
}

const {Option} = Select
const defaultOptions = [
  {key: 'custom', value: '自定义'},
  {key: 'calculate', value: '公式计算'},
]
const calculateOptions = [
  {key: 'add', value: '加法'},
  {key: 'minus', value: '减法'},
  {key: 'sum', value: '求和'},
  {key: 'average', value: '平均值'},
  {key: 'count', value: '计数'},
  {key: 'deduplicate', value: '去重计数'},
  {key: 'max', value: '最大值'},
  {key: 'min', value: '最小值'},
]
const NumberOption = (props: NumberOptionProps) => {

  const {id, value, onChange} = props
  // 默认值类型选择
  const [type, setType] = useState<string>(value?.type)
  // 公式计算类型选择
  const [calcType, setCalcType] = useState<string>(value?.calcType)
  // 公式计算的表单字段
  const [calculateData, setCalculateData] = useState<string | string[]>(value?.calculateData)
  // 改变默认值类型
  const handleChange = useMemoCallback((value: string) => {
    setType(value)
  })
  const handleInputBlur = useMemoCallback((e) => {
    const value: number = e.target.value
    onChange && onChange({id, type, customData: value})
  })
  // 改变公式计算类型
  const handleChangeCalcType = useMemoCallback((value) => {
    setCalcType(value)
    setCalculateData([])
    onChange && onChange({id, type, calcType: value})
  })
  // 改变公式计算表单控件
  const handleCalcChange = useMemoCallback((value) => {
    setCalculateData(value)
    onChange && onChange({id, type, calcType, calculateData: value})
  })

  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <div className={styles.custom_select}>
          <InputNumber
            size="large"
            className="input_number"
            min={props.min}
            max={props.max}
            placeholder="请选择"
            onBlur={handleInputBlur}
          />
        </div>
      )
    } else if (type === 'calculate') {
      return (
        <>
          <Select
            placeholder="请选择"
            className={styles.dict_content}
            size="large"
            suffixIcon={<Icon type="xiala"/>}
            value={calcType}
            onChange={handleChangeCalcType}
          >
            {calculateOptions.map(({key, value}) => (
              <Option value={key} key={key}>
                {value}
              </Option>
            ))}
          </Select>
          <CalculateSelect
            id={id}
            calcType={calcType}
            calculateData={calculateData}
            onChange={handleCalcChange}
          />
        </>
      )
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