import {memo, useMemo, useEffect} from 'react'
import {Select} from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {useAppSelector} from "@app/hooks";
import {componentPropsSelector} from "@/features/bpm-editor/form-design/formzone-reducer";
import {FormField} from "@type";
import styles from './index.module.scss'
import {Icon} from "@common/components";

const {Option} = Select

interface CalculateProps {
  calcType?: string;
  calculateData?: any;
  id?: string;
  onChange?: (value: string | string[]) => void
}

const CalculateSelect = (props: CalculateProps) => {

  const {calcType, id, onChange, calculateData} = props

  const byId = useAppSelector(componentPropsSelector);
  const fieldMulti = useMemo<{
    type: string;
    id: string;
    name: string;
    format?: string;
  }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => (com.type === 'InputNumber' || com.type === 'Date') && com.id !== id)
      .map((com) => ({
        id: com.fieldName,
        name: com.label,
        type: com.type,
        format: com.type === 'Date' ? com.format : ''
      }));
  }, [byId, id]);

  const field = useMemo<{ id: string; name: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    console.log(componentList, 'componentList')

    return componentList
      .filter((com) => (com.type === 'Tabs') && com.id !== id)
      .map((com) => {
        // console.log(com?.components, 'ddd')
        // return {}
        // {id: com.fieldName, name: com.label}
        if (com.type === 'Tabs' && com.components) {

          com.components.map(item => {

            const {config} = item
            return {
              id: config.parentId + config.id,
              name: `${com.label} · ${config.label}`
            }
          })
        }
        return {
          id: '',
          name: ''
        }
      });
  }, [byId, id]);

  // 处理加减法多选联动
  const handleDisableFields = useMemoCallback((field): boolean => {
    const prevField = fieldMulti.find(item => calculateData?.includes(item.id))
    if (!prevField) {
      return false
    } else if (prevField?.type === field.type) {
      let status = false
      if (field.type === 'Date') {
        if (prevField.format === field.format) {
          return false
        }
        status = true
      }
      return status
    }
    return true
  })
  const filterMultiFields = calculateData?.map((item: string) => {
    const field = fieldMulti.find(field => field.id === item)
    return field?.name
  }).filter((item: string) => !!item)

  const handleMultiChange = useMemoCallback((values) => {
    onChange && onChange(values)
  })

  const handleChangeField = useMemoCallback((values) => {
    onChange && onChange(values)
  })
  return (
    <>
      {
        (calcType === 'add' || calcType === 'minus') ?
          <>
            <Select
              mode="multiple"
              placeholder="请选择"
              size="large"
              onChange={handleMultiChange}
              value={calculateData}
              style={{width: '100%'}}
              maxTagCount={'responsive' as const}
            >
              {fieldMulti.map(item => (
                <Option key={item.id} value={item.id} disabled={handleDisableFields(item)}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <span className={styles.text_tips}>
            {filterMultiFields?.join(`${calcType === 'add' ? ' + ' : ' - '}`)}
          </span>
          </>
          :
          <>
            <Select
              placeholder="请选择"
              className={styles.dict_content}
              size="large"
              suffixIcon={<Icon type="xiala"/>}
              value={calculateData}
              onChange={handleChangeField}
            >
              {field.map(({id, name}) => (
                <Option value={id} key={id}>
                  {name}
                </Option>
              ))}
            </Select>
          </>
      }
    </>
  )
}

export default memo(CalculateSelect)