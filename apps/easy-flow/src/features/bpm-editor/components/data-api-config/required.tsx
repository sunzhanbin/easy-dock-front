import { memo, useContext } from "react";
import { Form, Button, Input } from "antd";
import classnames from "classnames";
import { Icon } from "@common/components";
import { Location, ParamName, FieldMap } from "./components";
import DataContext from "./context";
import styles from "./index.module.scss";

interface ReqiredProps {
  name: string[];
}

function Reqired(props: ReqiredProps) {
  const { name } = props;
  const { layout } = useContext(DataContext)!;

  return (
    <Form.List name={name}>
      {(fields) => (
        <>
          {fields.map((field: any) => {
            return (
              <div
                className={classnames(styles.row, { [styles.vertical]: layout === "vertical" })}
                key={field.fieldKey}
              >
                <Location name={[field.name, "location"]} />
                <div className={styles.detail}>
                  <ParamName name={[field.name, "name"]}>
                    <Input placeholder="请输入" size="large" disabled />
                  </ParamName>
                  <span className={styles.map}>对应</span>
                  <FieldMap name={[field.name, "map"]} />
                </div>
                <Button disabled className={styles.del} icon={<Icon type="shanchu" />} />
              </div>
            );
          })}
        </>
      )}
    </Form.List>
  );
}

export default memo(Reqired);
