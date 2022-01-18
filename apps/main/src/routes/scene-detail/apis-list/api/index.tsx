import { useMemo } from "react";
import classnames from "classnames";
import State, { StateProps } from "@components/state";
import Card from "../../card";
import styles from "./index.module.scss";

export type ApiShape = {
  name: string;
  version: string;
  createTime: number;
  state: 0 | 1 | 2;
  editGeneration: 0 | 1;
  id: number;
  remarks: string;
};

interface ApiProps {
  checked?: boolean;
  data: ApiShape;
  className?: string;
  showRadio?: boolean;
  onChecked?(api: ApiShape, checked: boolean): void;
  onDelete?(api: ApiShape): Promise<void>;
}

export default function Api(props: ApiProps) {
  const { checked, data, className, onChecked, onDelete } = props;
  const stateNode = useMemo(() => {
    let info: { text: string; state: StateProps["state"] };

    if (data.state === 0) {
      info = {
        state: "editing",
        text: "编辑中",
      };
    } else if (data.state === 2) {
      info = {
        state: "success",
        text: "已发布",
      };
    } else {
      info = {
        state: "waiting",
        text: "待发布",
      };
    }

    return <State state={info.state}>{info.text}</State>;
  }, [data.state]);

  const handleChecked = useMemo(() => {
    if (onChecked) {
      return (checked: boolean) => {
        if (typeof onChecked === "function") {
          onChecked(data, checked);
        }
      };
    }
  }, [onChecked, data]);

  const createTimeText = useMemo(() => {
    if (!data.createTime) {
      return "-";
    }

    const date = new Date(data.createTime);

    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}创建`;
  }, [data.createTime]);

  const handleDelete = useMemo(() => {
    if (onDelete) {
      return async () => {
        if (typeof onDelete === "function") {
          return onDelete(data);
        }
      };
    }
  }, [onDelete, data]);

  return (
    <Card
      className={classnames(className, styles.card)}
      title={data.name}
      state={stateNode}
      checked={checked}
      onChecked={handleChecked}
      onDelete={handleDelete}
    >
      <div className={styles.info}>
        <div className={styles.type}>{data.editGeneration === 1 ? "编排" : "原生"}</div>
        <div className={styles.version}>{data.version}</div>
        <div className={styles.separator}>|</div>
        <div className={styles.time}>{createTimeText}</div>
      </div>
    </Card>
  );
}
