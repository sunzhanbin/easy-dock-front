import React, { useMemo } from "react";
import { Popconfirm } from "antd";
import { PopconfirmProps } from "antd/lib/popconfirm";
import "./index.style.scss";

interface ConfirmProps extends PopconfirmProps {
  content: React.ReactNode;
  title: React.ReactNode;
}

function Confirm(props: ConfirmProps) {
  const { content, title, children, cancelButtonProps, okButtonProps, ...others } = props;
  const mixinTitle = useMemo(() => {
    return (
      <div className="container">
        <div className="title">{title}</div>
        <div className="content">{content}</div>
      </div>
    );
  }, [title, content]);

  const cancelProps = useMemo(() => {
    return Object.assign({}, { type: "text", size: "middle" }, cancelButtonProps);
  }, [cancelButtonProps]);

  const okProps = useMemo(() => {
    return Object.assign({}, { type: "primary", size: "middle" }, okButtonProps);
  }, [okButtonProps]);

  return (
    <Popconfirm
      title={mixinTitle}
      cancelButtonProps={cancelProps}
      okButtonProps={okProps}
      overlayClassName="popover"
      {...others}
    >
      {children}
    </Popconfirm>
  );
}

export default React.memo(Confirm);
