import React from "react";
import { createFromIconfontCN } from "@ant-design/icons";
import classnames from "classnames";
import "@assets/icon/index.style.scss";

interface IconProps {
  type: string;
  className?: string;
  style?: React.CSSProperties;

  onClick?(event: React.MouseEvent): void;
}

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_2473458_cnjakmjf7y.js",
});

export default function Icon(
  props: IconProps
): React.ComponentElement<any, any> {
  const { className, style, onClick, type } = props;

  return (
    <IconFont
      className={classnames("icon", className)}
      aria-hidden="true"
      style={style}
      onClick={onClick}
      type={type}
    />
  );
}
