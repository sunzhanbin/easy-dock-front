import { memo, useContext } from "react";
import { Form, Button, Select, Input } from "antd";
import classnames from "classnames";
import { Icon } from "@common/components";
import { ParamType } from "@type/api";
import { Location, ParamName, FieldMap } from "./components";
import DataContext from "./context";
import styles from "./index.module.scss";

interface CustomProps {
  name: string[];
}

function Custom(props: CustomProps) {
  const { name } = props;
  const { detail, layout, getPopupContainer } = useContext(DataContext)!;

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        const customize = form.getFieldValue(name);

        return (
          <Form.List name={name}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field: any, index) => {
                  const { type } = customize[index];

                  return (
                    <div
                      className={classnames(styles.row, { [styles.vertical]: layout === "vertical" })}
                      key={field.fieldKey}
                    >
                      <Location name={[field.name, "location"]} />
                      <div className={styles.detail}>
                        {type === ParamType.Optional ? (
                          <ParamName name={[field.name, "name"]}>
                            <Select
                              size="large"
                              placeholder="请选择"
                              getPopupContainer={getPopupContainer}
                              dropdownMatchSelectWidth={false}
                            >
                              {detail?.optionals?.map((param) => {
                                const name = param.name;

                                return (
                                  <Select.Option key={name} value={name}>
                                    {name}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </ParamName>
                        ) : (
                          <ParamName name={[field.name, "name"]}>
                            <Input placeholder="请输入" size="large" />
                          </ParamName>
                        )}

                        <span className={styles.map}>对应</span>
                        <FieldMap name={[field.name, "map"]} />
                      </div>
                      <Button
                        onClick={() => remove(field.name)}
                        className={styles.del}
                        icon={<Icon type="shanchu" />}
                      />
                    </div>
                  );
                })}

                <div className={styles.btns}>
                  {/* <Button icon={<Icon type="xinzeng" />} onClick={() => add({ type: ParamType.Optional })}>
                    添加已获取的参数
                  </Button> */}
                  <Button icon={<Icon type="xinzeng" />} onClick={() => add({ type: ParamType.Customize })}>
                    新增参数
                  </Button>
                </div>
              </>
            )}
          </Form.List>
        );
      }}
    </Form.Item>
  );
}

export default memo(Custom);
