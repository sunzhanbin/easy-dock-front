import { memo, FC, ReactNode, useMemo } from "react";
import { SubAppType } from "@/consts";
import FormImage from "@assets/images/form.png";
import FlowImage from "@assets/images/flow.png";
import ChartImage from "@assets/images/chart.png";
import CanvasImage from "@assets/images/canvas.png";
import SpaceImage from "@assets/images/space.png";
import "./app-empty.style.scss";
import { Icon } from "@common/components";
import { Button } from "antd";
import AppModal from "./app-modal.component";

interface TypeItem {
  type: SubAppType;
  title: string;
  desc: string;
  children: ReactNode;
}

const AppEmpty: FC = () => {
  const typeList = useMemo<TypeItem[]>(() => {
    return [
      {
        type: SubAppType.FORM,
        title: "新建表单",
        desc: "配置表单、列表",
        children: <img src={FormImage} alt="图片" className="image" />,
      },
      {
        type: SubAppType.FLOW,
        title: "新建流程",
        desc: "配置流程",
        children: <img src={FlowImage} alt="图片" className="image" />,
      },
      {
        type: SubAppType.CHART,
        title: "新建报表",
        desc: "配置业务统计报表",
        children: <img src={ChartImage} alt="图片" className="image" />,
      },
      {
        type: SubAppType.CANVAS,
        title: "新建大屏",
        desc: "配置可视化大屏",
        children: <img src={CanvasImage} alt="图片" className="image" />,
      },
      {
        type: SubAppType.SPACE,
        title: "新建空间",
        desc: "配置3D空间、动画等",
        children: <img src={SpaceImage} alt="图片" className="image" />,
      },
    ];
  }, []);
  return (
    <div className="app-empty">
      {typeList.map(({ type, title, desc, children }) => {
        return (
          <div className="empty-item" key={type}>
            <div className="title">{title}</div>
            <div className="desc">{desc}</div>
            <div className="children">{children}</div>
            <div className="button">
              <Button
                className="btn"
                size="large"
                type="primary"
                shape="circle"
                icon={<Icon type="xinzeng" />}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(AppEmpty);
