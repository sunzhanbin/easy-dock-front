import { memo, useContext, useMemo } from 'react';
import { Form, Input, Button, Select } from 'antd';
import classnames from 'classnames';
import { Icon } from '@common/components';
import { ParamType } from '@type/api';
import { ParamName, FieldMap } from './components';
import DataContext from './context';
import styles from './index.module.scss';
import { AutoSelector } from './components/map';

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
                    <Form.Item shouldUpdate noStyle>
                      {(form) => {
                        const value = form.getFieldValue(name);
                        const { type } = value?.[index] || {};
                        const optionals = (detail?.responses || []).map((v: { name: string }) => ({
                          name: v.name,
                          id: v.name,
                        }));
                        let paramNameChildren;

                        if (type === ParamType.Optional) {
                          paramNameChildren = <AutoSelector options={optionals} />;
                        } else {
                          paramNameChildren = <Input placeholder="请输入" size="large" />;
                        }

                        return <ParamName name={[field.name, 'name']}>{paramNameChildren}</ParamName>;
                      }}
                    </Form.Item>

                    <span className={styles.map}>对应</span>
                    <FieldMap name={[field.name, 'map']} isAutoSelect={false} />
                  </div>
                  <Button className={styles.del} icon={<Icon type="shanchu" />} onClick={() => remove(index)} />
                </div>
              );
            })}

            <div className={styles.btns}>
              {/* <Button icon={<Icon type="xinzeng" />} onClick={() => add({ type: ParamType.Optional })}>
                添加已获取的参数
              </Button> */}
              <Button icon={<Icon type="xinzeng" />} onClick={() => add({ type: ParamType.Optional })}>
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
