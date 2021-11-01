import React, {memo, useState} from "react";
import {Form, Modal, Select} from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "../index.module.scss";
import {RuleOption} from "@type";
import {getPopupContainer} from '@utils';
import {DATE_DEFAULT_FORMAT, DateOptions} from '@utils/const'

interface DateProps {
  showDateModal: boolean;
  onCancel: () => void;
  onSubmit: (fieldsValue: any) => void;
  data: RuleOption
}

const {Option} = Select;
const MODAL_TYPE = {type: 'createTime'}

const DateModal = (props: DateProps) => {
  const {showDateModal, onCancel, onSubmit, data} = props
  const [form] = Form.useForm();
  const [format, setDateFormat] = useState<string>(data.format || DATE_DEFAULT_FORMAT);  // 重置周期

  const handleSubmit = useMemoCallback(() => {
    const params = Object.assign({}, MODAL_TYPE, form.getFieldsValue())
    onSubmit && onSubmit(params)
  })

  return (
    <Modal
      width={500}
      bodyStyle={{height: '150px'}}
      className={styles.modalIncrease}
      visible={showDateModal}
      title={'日期格式设置'}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="确 认"
      cancelText="取 消"
      cancelButtonProps={{type: 'text', size: 'large'}}
      okButtonProps={{size: 'large'}}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Form form={form}
            layout="horizontal"
            autoComplete="off"
            labelCol={{span: 4}}
            wrapperCol={{span: 19}}
            initialValues={props.data}
      >
        <Form.Item label="日期格式" name="format" style={{marginBottom: '5px'}}>
          <Select
            placeholder="请选择"
            size="large"
            className={styles.formItem}
            value={format}
            onChange={(value) => setDateFormat(value)}
            getPopupContainer={getPopupContainer}
          >
            {DateOptions.map(({key, value}) => (
              <Option key={key} value={key} label={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default memo(DateModal)