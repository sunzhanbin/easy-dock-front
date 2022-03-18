import { FC, memo } from "react";
import ToolBoxItem from "@/components/toolbox-item";
import { useAppSelector } from "@app/hooks";
import { toolboxSelector } from "./toolbox-reducer";
import Loading from "@components/loading";
import { map } from "lodash";
import styles from "./index.module.scss";

const ToolBox: FC = () => {
  const components = useAppSelector(toolboxSelector);
  const comGroups = map(components, (value, key) => {
    return (
      <div className={styles.group} key={key}>
        <div className={styles.groupTitle}>{key}</div>
        <div className={styles.componentContainer}>
          {map(value, (tool, index) => {
            const { name, icon, type, disabled = false } = tool;
            return (
              <ToolBoxItem icon={icon} displayName={name} type={type} key={type} disabled={disabled}></ToolBoxItem>
            );
          })}
        </div>
      </div>
    );
  });
  if (!comGroups) return <Loading></Loading>;
  return (
    <div className={styles.container}>
      <div>{comGroups}</div>
    </div>
  );
};

export default memo(ToolBox);
