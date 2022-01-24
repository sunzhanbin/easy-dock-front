import { memo, FC, ReactNode, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Button } from "antd";
import { SubAppType } from "@/consts";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import SpaceImage from "@assets/images/space.png";
import { useCreateSupAppMutation } from "@/http/app-manager.hooks";
import FormImage from "@assets/images/form.png";
import FlowImage from "@assets/images/flow.png";
import ChartImage from "@assets/images/chart.png";
import CanvasImage from "@assets/images/canvas.png";
import AppModal from "./app-modal.component";
import "./app-empty.style.scss";

type TypeItem = {
  type: SubAppType;
  title: string;
  desc: string;
  position: "left" | "right";
  children: ReactNode;
  showModal: boolean;
};

type ShowModalMap = {
  [k in SubAppType]: boolean;
};

const initialShowModal: ShowModalMap = {
  [SubAppType.FORM]: false,
  [SubAppType.FLOW]: false,
  [SubAppType.CHART]: false,
  [SubAppType.CANVAS]: false,
  [SubAppType.SPACE]: false,
};

const AppEmpty: FC<{ empty?: boolean }> = ({ empty = false }) => {
  const { workspaceId } = useParams();
  const [createSubApp] = useCreateSupAppMutation();
  const [showModal, setShowModal] = useState<ShowModalMap>(initialShowModal);
  const typeList = useMemo<TypeItem[]>(() => {
    return [
      {
        type: SubAppType.FORM,
        title: "新建表单",
        desc: "配置表单、列表",
        position: "left",
        children: <img src={FormImage} alt="图片" className="image" />,
        showModal: showModal[SubAppType.FORM],
      },
      {
        type: SubAppType.FLOW,
        title: "新建流程",
        desc: "配置流程",
        position: "left",
        children: <img src={FlowImage} alt="图片" className="image" />,
        showModal: showModal[SubAppType.FLOW],
      },
      {
        type: SubAppType.CHART,
        title: "新建报表",
        desc: "配置业务统计报表",
        position: "left",
        children: <img src={ChartImage} alt="图片" className="image" />,
        showModal: showModal[SubAppType.CHART],
      },
      {
        type: SubAppType.CANVAS,
        title: "新建大屏",
        desc: "配置可视化大屏",
        position: "left",
        children: <img src={CanvasImage} alt="图片" className="image" />,
        showModal: showModal[SubAppType.CANVAS],
      },
      {
        type: SubAppType.SPACE,
        title: "新建空间",
        desc: "配置3D空间、动画等",
        position: "right",
        children: <img src={SpaceImage} alt="图片" className="image" />,
        showModal: showModal[SubAppType.SPACE],
      },
    ];
  }, [showModal]);
  const handleShowModal = useMemoCallback((type: SubAppType) => {
    if (empty) {
      message.warn("请先创建工作区!");
      return;
    }
    const showModal: ShowModalMap = { ...initialShowModal, [type]: true };
    setShowModal(showModal);
  });
  const handleClose = useMemoCallback(() => {
    setShowModal(initialShowModal);
  });
  const handleOk = useMemoCallback((name: string, type: SubAppType) => {
    createSubApp({ appId: Number(workspaceId), name, type })
      .unwrap()
      .then(() => {
        message.success("子应用创建成功!");
      });
  });
  return (
    <div className="app-empty">
      {typeList.map(({ type, title, desc, children, showModal, position }) => {
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
                onClick={() => handleShowModal(type)}
              />
            </div>
            {showModal && (
              <AppModal
                mode="create"
                className="empty-modal"
                type={type}
                position={position}
                onClose={handleClose}
                onOk={(name, type) => handleOk(name, type)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(AppEmpty);
