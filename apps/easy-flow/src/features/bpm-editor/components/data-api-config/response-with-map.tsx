import { memo, useContext, useMemo } from 'react';
import { Form, Input, Button, Select } from 'antd';
import classnames from 'classnames';
import { Icon } from '@common/components';
import { ParamName, FieldMap } from './components';
import DataContext from './context';
import { ParamType } from '@type/api';
import styles from './index.module.scss';

interface ResponseWithMapProps {
  label: string;
}

function ResponseWithMap(props: ResponseWithMapProps) {
  const { label } = props;
  const { name: parentName, detail, getPopupContainer } = useContext(DataContext)!;
  const name = useMemo(() => {
    return [...parentName, 'response'];
  }, [parentName]);

  return (
    <>
      <div className={styles.subtitle}>{label}</div>

      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => {
              return (
                <div className={classnames(styles.row)} key={field.fieldKey}>
                  <div className={styles.detail}>
                    <ParamName name={[field.name, 'name']}>
                      <Form.Item shouldUpdate={() => true} style={{ margin: 0 }}>
                        {(form) => {
                          const value = form.getFieldValue(name);
                          const { type } = value[index];
                          const optionals = detail?.responses || [];

                          if (type === ParamType.Optional && optionals.length > 0) {
                            return (
                              <Select
                                size="large"
                                placeholder="请选择"
                                getPopupContainer={getPopupContainer}
                                dropdownMatchSelectWidth={false}
                              >
                                {optionals.map((param) => {
                                  const name = param.name;

                                  return (
                                    <Select.Option key={name} value={name}>
                                      {name}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            );
                          }

                          return <Input placeholder="请输入" size="large" />;
                        }}
                      </Form.Item>
                    </ParamName>
                    <span className={styles.map}>对应</span>
                    <FieldMap name={[field.name, 'map']} />
                  </div>
                  <Button className={styles.del} icon={<Icon type="shanchu" />} onClick={() => remove(index)} />
                </div>
              );
            })}

            <div className={styles.btns}>
              <Button icon={<Icon type="xinzeng" />} onClick={() => add({ type: ParamType.Optional })}>
                添加已获取的参数
              </Button>
              <Button icon={<Icon type="xinzeng" />} onClick={() => add({ type: ParamType.Customize })}>
                新增参数
              </Button>
            </div>
          </>
        )}
      </Form.List>
    </>
  );
}

export default memo(ResponseWithMap);
