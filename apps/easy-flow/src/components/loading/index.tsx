import { Spin } from "antd";
import classnames from "classnames";
import { SpinSize } from "antd/lib/spin";
import styles from "./index.module.scss";

interface LoadingProps {
  size?: SpinSize;
  className?: string;
}

export default function Loading(props: LoadingProps) {
  const { size, className } = props;

  return <Spin className={classnames(styles.loading, className)} size={size} spinning />;
}
