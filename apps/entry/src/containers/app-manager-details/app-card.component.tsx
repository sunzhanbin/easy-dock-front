import React, { memo, FC, ReactNode, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { message } from "antd";
import { SubAppInfo, SubAppType } from "@/consts";
import FormImage from "@assets/images/form.png";
import FlowImage from "@assets/images/flow.png";
import ChartImage from "@assets/images/chart.png";
import CanvasImage from "@assets/images/canvas.png";
import SpaceImage from "@assets/images/space.png";
import { Icon, Text, PopoverConfirm } from "@common/components";
import { JumpLinkToUrl } from "@utils/utils";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {
  useModifySubAppNameMutation,
  useModifySubAppStatusMutation,
  useDeleteSupAppMutation,
  useGetHolosceneIdMutation,
  useGetCanvasIdMutation,
} from "@/http/app-manager.hooks";
import AppModal from "./app-modal.component";
import "./app-card.style.scss";

interface AppCardProps {
  subApp: SubAppInfo;
  className?: string;
}

const AppCard: FC<AppCardProps> = ({ subApp, className }) => {
  const { id, name, status, type, version } = subApp;
  const [modifySubAppStatus] = useModifySubAppStatusMutation();
  const [modifySubAppName] = useModifySubAppNameMutation();
  const [deleteSubApp] = useDeleteSupAppMutation();
  const [getHolosceneId] = useGetHolosceneIdMutation();
  const [getCanvasId] = useGetCanvasIdMutation();
  const imageMap = useMemo<{ [k in SubAppType]: string }>(() => {
    return {
      [SubAppType.CANVAS]: CanvasImage,
      [SubAppType.CHART]: ChartImage,
      [SubAppType.FORM]: FormImage,
      [SubAppType.FLOW]: FlowImage,
      [SubAppType.SPACE]: SpaceImage,
    };
  }, []);
  const typeMap = useMemo<{ [k in SubAppType]: string }>(() => {
    return {
      [SubAppType.CANVAS]: "大屏",
      [SubAppType.CHART]: "报表",
      [SubAppType.FORM]: "表单",
      [SubAppType.FLOW]: "流程",
      [SubAppType.SPACE]: "空间",
    };
  }, []);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [position, setPosition] = useState<"left" | "right">("left");
  const statusInfo = useMemo<{ text: string; className: string }>(() => {
    // 未发布(没有版本信息)的子应用为编排中状态
    if (!version || !version.version) {
      return { text: "编排中", className: "editing" };
    }
    if (status === 1) {
      return { text: "已启用", className: "enable" };
    }
    return { text: "已停用", className: "disabled" };
  }, [status, version]);

  const statusNode = useMemo<ReactNode>(() => {
    const { text, className } = statusInfo;
    return <div className={classNames("status", className)}>{text}</div>;
  }, [statusInfo]);

  const getPopupContainer = useMemoCallback(() => {
    return cardRef.current!;
  });
  const handleSuccess = useMemoCallback((msg?: string) => {
    setShowPopup(false);
    msg && message.success(msg);
  });
  const handleStart = useMemoCallback(() => {
    modifySubAppStatus({ id, status: 1 }).then(() => {
      handleSuccess("启用成功!");
    });
  });
  const handleStop = useMemoCallback(() => {
    modifySubAppStatus({ id, status: -1 }).then(() => {
      handleSuccess("停用成功!");
    });
  });
  const handleEdit = useMemoCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const { x = 0 } = cardRef.current?.getBoundingClientRect() as DOMRect;
    if (document.body.clientWidth - x < 470) {
      setPosition("right");
    }
    setShowPopup(false);
    setShowModal(true);
  });
  const handleDelete = useMemoCallback(() => {
    deleteSubApp(id).then(() => {
      handleSuccess("删除成功!");
    });
  });
  const handleOk = useMemoCallback((name) => {
    modifySubAppName({ id, name }).then(() => {
      message.success("修改成功!");
    });
  });
  const content = useMemo<ReactNode>(() => {
    return (
      <div className="operation">
        {statusInfo.text === "已停用" && (
          <PopoverConfirm
            title="提示"
            placement="bottom"
            content="请确认是否启用该子应用?"
            getPopupContainer={getPopupContainer}
            onConfirm={handleStart}
          >
            <div className="app_operation_item">
              <Icon type="gou" />
              <div>启用</div>
            </div>
          </PopoverConfirm>
        )}
        {statusInfo.text === "已启用" && (
          <PopoverConfirm
            title="提示"
            placement="bottom"
            content="请确认是否停用该子应用?"
            getPopupContainer={getPopupContainer}
            onConfirm={handleStop}
          >
            <div className="app_operation_item">
              <Icon type="guanbi" />
              <div>停用</div>
            </div>
          </PopoverConfirm>
        )}
        <div
          className="app_operation_item"
          onClick={(e: React.MouseEvent) => handleEdit(e)}
        >
          <Icon type="bianji" />
          <div>编辑</div>
        </div>
        {statusInfo.text !== "已启用" && (
          <PopoverConfirm
            title="提示"
            placement="bottom"
            content="删除后不可恢复,请确认是否删除该子应用?"
            getPopupContainer={getPopupContainer}
            onConfirm={handleDelete}
          >
            <div className="app_operation_item">
              <Icon type="shanchu" />
              <div>删除</div>
            </div>
          </PopoverConfirm>
        )}
      </div>
    );
  }, [statusInfo, getPopupContainer]);

  const handleJumpTo = useMemoCallback(async () => {
    await JumpLinkToUrl(type, id, getCanvasId, getHolosceneId);
  });
  return (
    <div
      ref={cardRef}
      className={classNames("app-card-container", className && className)}
      onMouseLeave={() => setShowPopup(false)}
      onClick={handleJumpTo}
    >
      <div className="app-card-base">
        <img src={imageMap[type]} alt="icon" className="app-image" />
        <div className="name">
          <Text text={name} />
        </div>
      </div>
      <div className="app-card-more">
        <div className="info">
          {version?.version && (
            <span className="version">{version?.version}</span>
          )}
          <span className="type">{typeMap[type]}</span>
        </div>
        <div className="more" onClick={() => setShowPopup(true)}>
          <Icon type="gengduo" className="icon" />
          {showPopup && content}
        </div>
      </div>
      {statusNode}
      {showModal && (
        <AppModal
          mode="edit"
          type={type}
          name={name}
          position={position}
          onClose={() => setShowModal(false)}
          onOk={(name) => handleOk(name)}
        />
      )}
    </div>
  );
};

export default memo(AppCard);
