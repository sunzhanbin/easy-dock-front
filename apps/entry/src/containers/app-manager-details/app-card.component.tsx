import React, { memo, FC, ReactNode, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { message } from "antd";
import { SubAppInfo } from "@/consts";
import { Icon, Text, PopoverConfirm } from "@common/components";
import { JumpLinkToUrl } from "@utils/utils";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {
  useModifySubAppNameMutation,
  useModifySubAppStatusMutation,
  useDeleteSupAppMutation,
  useGetHoloSceneIdMutation,
  useGetCanvasIdMutation,
} from "@/http/app-manager.hooks";
import { ImageMap, NameMap } from "@utils/const";
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
  const [getHoloSceneId] = useGetHoloSceneIdMutation();
  const [getCanvasId] = useGetCanvasIdMutation();
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
  const handleClosePopup = useMemoCallback(() => {
    setShowPopup(false);
  });
  const handleSuccessTip = useMemoCallback((msg: string) => {
    msg && message.success(msg);
  });
  const handleStart = useMemoCallback(() => {
    modifySubAppStatus({ id, status: 1 })
      .unwrap()
      .then(() => {
        handleSuccessTip("启用成功!");
      })
      .finally(() => {
        handleClosePopup();
      });
  });
  const handleStop = useMemoCallback(() => {
    modifySubAppStatus({ id, status: -1 })
      .unwrap()
      .then(() => {
        handleSuccessTip("停用成功!");
      })
      .finally(() => {
        handleClosePopup();
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
    deleteSubApp(id)
      .unwrap()
      .then(() => {
        handleSuccessTip("删除成功!");
      })
      .finally(() => {
        handleClosePopup();
      });
  });
  const handleOk = useMemoCallback((name) => {
    modifySubAppName({ id, name })
      .unwrap()
      .then(() => {
        handleSuccessTip("修改成功!");
      })
      .finally(() => {
        handleClosePopup();
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
        <div className="app_operation_item" onClick={(e: React.MouseEvent) => handleEdit(e)}>
          <Icon type="bianji" />
          <div>编辑</div>
        </div>
        {statusInfo.text === "已停用" && (
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
  }, [statusInfo, getPopupContainer, handleStart, handleStop, handleEdit, handleDelete]);

  const handleShowOperation = useMemoCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(true);
  });

  const handleJumpTo = useMemoCallback(async () => {
    await JumpLinkToUrl(type, id, getCanvasId, getHoloSceneId);
  });
  return (
    <div
      ref={cardRef}
      className={classNames("app-card-container", className && className)}
      onMouseLeave={() => setShowPopup(false)}
      onClick={handleJumpTo}
    >
      <div className="app-card-base">
        <img src={ImageMap[type]} alt="icon" className="app-image" />
        <div>
          <Text text={name} className="name" />
          <div className="app-card-more">
            <div className="info">
              {version?.version && <span className="version">{version?.version}</span>}
              <span className="type">{NameMap[type]}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="more" onClick={(e) => handleShowOperation(e)}>
        <Icon type="gengduo" className="icon" />
        {showPopup && content}
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
