import { memo, FC } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";

const TimeoutState: FC<{ className?: string }> = ({ className }) => {
  return <div className={classNames(styles["timeout-state"], className ? className : "")}>超时</div>;
};

export default memo(TimeoutState);
