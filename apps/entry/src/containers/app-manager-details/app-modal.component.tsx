import React, { memo, FC, useMemo, useState } from "react";
import { Button, Form, Input } from "antd";
import classNames from "classnames";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { nameRule, SubAppType } from "@/consts";
import FormImage from "@assets/images/form.png";
import FlowImage from "@assets/images/flow.png";
import ChartImage from "@assets/images/chart.png";
import CanvasImage from "@assets/images/canvas.png";
import SpaceImage from "@assets/images/space.png";
import "./app-modal.style.scss";

interface AppModalProps {
  mode: "create" | "edit";
  type?: SubAppType;
  name?: string;
  position?: "left" | "right";
  className?: string;
  onClose: () => void;
  onOk: (name: string, type: SubAppType) => void;
}

interface TypeItem {
  name: string;
  image: string;
  type: SubAppType;
}

const AppModal: FC<AppModalProps> = ({
  type,
  mode,
  name,
  position = "left",
  className,
  onOk,
  onClose,
}) => {
  const [form] = Form.useForm();
  const containerStyle = useMemo(() => {
    if (position === "left") {
      return { left: 0 };
    }
    return { right: 0 };
  }, [position]);
  const typeList = useMemo<TypeItem[]>(() => {
    return [
      { name: "表单", image: FormImage, type: SubAppType.FORM },
      { name: "流程", image: FlowImage, type: SubAppType.FLOW },
      { name: "报表", image: ChartImage, type: SubAppType.CHART },
      { name: "大屏", image: CanvasImage, type: SubAppType.CANVAS },
      { name: "空间", image: SpaceImage, type: SubAppType.SPACE },
    ];
  }, []);
  const [selectType, setSelectType] = useState<SubAppType>(SubAppType.FORM);
  const handleClose = useMemoCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  });
  const handleOk = useMemoCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    form.validateFields().then(({ name }) => {
      const subAppType = type ? type : selectType;
      onOk(name, subAppType);
      onClose();
    });
  });
  return (
    <div
      className={classNames("app-modal", className ? className : "")}
      style={containerStyle}
    >
      <div className="header">
        <div className="title">{mode === "create" ? "新建" : "编辑"}子应用</div>
        <div className="close" onClick={handleClose}>
          <Icon type="guanbi" className="icon" />
        </div>
      </div>
      <div className="content">
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="name"
            label="子应用名称"
            initialValue={name}
            required
            rules={[nameRule]}
          >
            <Input autoFocus size="large" placeholder="请输入" />
          </Form.Item>
          {mode === "create" && !type && (
            <Form.Item className="form-item" label="子应用类型" required>
              <div className="type-list">
                {typeList.map(({ name, image, type }) => (
                  <div
                    className={classNames(
                      "type-card",
                      selectType === type ? "active" : ""
                    )}
                    key={name}
                    onClick={() => setSelectType(type)}
                  >
                    <div className="image">
                      <img src={image} alt="图标" />
                    </div>
                    <div className="name">{name}</div>
                  </div>
                ))}
              </div>
            </Form.Item>
          )}
        </Form>
      </div>
      <div className="model_footer">
        <div className="operation">
          <Button
            type="text"
            size="large"
            className="cancel"
            onClick={(e) => handleClose(e)}
          >
            取消
          </Button>
          <Button type="primary" size="large" onClick={(e) => handleOk(e)}>
            确定
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(AppModal);
