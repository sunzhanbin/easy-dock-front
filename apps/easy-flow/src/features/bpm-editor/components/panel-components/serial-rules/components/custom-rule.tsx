import { memo } from 'react';
import RuleComponent from './rule-component';
import styles from '../index.module.scss';
import { Form, Button } from 'antd';

const CustomRule = () => {
  return (
    <>
      {/*<RuleComponent*/}
      {/*  form={formSerial}*/}
      {/*  rules={rules}*/}
      {/*  ruleName={ruleName}*/}
      {/*  type="custom"*/}
      {/*  id={id}*/}
      {/*  onChange={handleOnChange}*/}
      {/*  fields={fields}*/}
      {/*/>*/}
      {/*<Form.Item noStyle>*/}
      {/*  <Button className={styles.save_custom} size="large" onClick={handleSaveRules}>*/}
      {/*    <span>保存并应用</span>*/}
      {/*  </Button>*/}
      {/*</Form.Item>*/}
    </>
  );
};

export default memo(CustomRule);
