import { memo } from "react";
import emptyImage from "@assets/empty.png";
import styles from "./index.module.scss";

interface EmptyProps {
  className?: string;
  text: string;
}

function Empty(props: EmptyProps) {
  const { text } = props;

  return (
    <div className={styles.container}>
      <img src={emptyImage} alt="" />
      <div>{text}</div>
    </div>
  );
}

export default memo(Empty);
