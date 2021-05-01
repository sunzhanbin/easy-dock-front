import React from "react";
import classnames from "classnames";
import "./iconfont";
import styles from "./index.module.scss";

interface IconProps {
  type: string;
  className?: string;
  onClick?(event: React.MouseEvent): void;
}

export default function Icon(props: IconProps) {
  const { type, className, onClick } = props;

  return (
    <svg className={classnames(styles.icon, className)} aria-hidden="true" onClick={onClick}>
      <use xlinkHref={`#icon${type}`}></use>
    </svg>
  );
}
