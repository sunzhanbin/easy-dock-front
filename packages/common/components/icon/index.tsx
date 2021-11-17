import React from 'react';
import {createFromIconfontCN } from '@ant-design/icons';
import classnames from "classnames";
import styles from './index.module.scss';

interface IconProps {
  type: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?(event: React.MouseEvent): void;
}


const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2473458_jxgstadh0h.js'
});

export default function EdIcon(props: IconProps) : React.ComponentElement<any, any> {
  const { className, style, onClick, type } = props;

  return (
    <IconFont className={classnames(styles.icon, className)} aria-hidden="true" style={style} onClick={onClick} type={`custom-icon-${type}`}/>
  );
}
