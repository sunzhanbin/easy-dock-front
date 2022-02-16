import { memo, FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message } from "antd";
import classNames from "classnames";
import { Icon, Text } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { useAppDispatch, useAppSelector } from "@/store";
import { useWorkspaceDetailQuery, useSaveAppSetupMutation, useModifyAppStatusMutation } from "@/http";
import { setName } from "@/views/workspace/index.slice";
import { selectMenu } from "@/views/app-setup/menu-setup.slice";
import { setCurrentWorkspaceId } from "@/views/app-manager/index.slice";
import { selectBasicForm, validateBasicForm } from "@/views/app-setup/basic-setup.slice";
import AppPreviewModal from "@containers/app-preview-modal";
import "./app-manager-header.style.scss";
import { filterAssetConfig } from "@utils/utils";

interface EditHeaderProps {
  className?: string;
}

// interface NavItem {
//   key: string;
//   title: string;
// }

const AppManagerHeader: FC<EditHeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const { projectId, workspaceId } = useParams();
  const dispatch = useAppDispatch();
  const { data: workspace } = useWorkspaceDetailQuery(Number(workspaceId), {
    skip: !workspaceId,
  });
  const [saveAppSetup] = useSaveAppSetupMutation();
  const [modifyAppStatus] = useModifyAppStatusMutation();
  const basicConfig = useAppSelector(selectBasicForm);
  const menuList = useAppSelector(selectMenu);
  // const [activeNav, setActiveNav] = useState<string>("edit");
  const [showModal, setShowModal] = useState<boolean>(false);
  // const navList = useMemo<NavItem[]>(() => {
  //   return [{ key: "edit", title: "应用设计" }];
  // }, []);
  const handleBack = useMemoCallback(() => {
    navigate(`/app-manager/project/${projectId}/workspace/${workspaceId}`);
  });
  const handlePreview = useMemoCallback(() => {
    setShowModal(true);
  });
  const handleModalClose = useMemoCallback(() => {
    setShowModal(false);
  });
  const handleSave = useMemoCallback(async (showTip = true) => {
    const basicConfigResult = await dispatch(validateBasicForm(basicConfig));
    if (basicConfigResult.meta.requestStatus === "rejected") {
      message.error("请检查应用设置!");
      return Promise.reject("error");
    }
    if (!menuList?.length) {
      message.error("请添加菜单!");
      return Promise.reject("error");
    }
    const menus = filterAssetConfig(JSON.parse(JSON.stringify(menuList)));
    const { name, icon, remark, navMode, theme } = basicConfig;
    const params = {
      name,
      icon,
      navMode,
      remark,
      theme,
      id: +(workspaceId as string),
      meta: { menuList: menus },
    };
    try {
      await saveAppSetup(params).unwrap();
      showTip && message.success("保存成功!");
      return Promise.resolve("success");
    } catch (error) {
      return Promise.reject("error");
    }
  });
  const handlePublish = useMemoCallback(async () => {
    try {
      await handleSave(false);
      await modifyAppStatus({ id: +(workspaceId as string), status: 1 }).unwrap();
      message.success("发布成功!");
      navigate(`/app-manager/project/${projectId}/workspace/${workspaceId}`);
    } catch (error) {
      console.error(error);
    }
  });
  useEffect(() => {
    if (workspace?.name) {
      dispatch(setName(workspace.name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace?.name]);
  useEffect(() => {
    if (workspaceId) {
      dispatch(setCurrentWorkspaceId(+workspaceId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);
  return (
    <div className={classNames("app-manager-header", className && className)}>
      <div className="left" onClick={handleBack}>
        <Icon type="fanhui" className="back" />
        <div className="workspace-name">
          <Text text={workspace?.name} />
        </div>
      </div>
      {/* 只有一个应用编排,暂时干掉 */}
      <div className="nav-list">
        {/* {navList.map(({ key, title }) => {
          return (
            <div
              key={key}
              className={classNames("nav-item", activeNav === key && "active")}
              onClick={() => setActiveNav(key)}
            >
              {title}
            </div>
          );
        })} */}
      </div>
      <div className="right">
        <div className="preview" onClick={handlePreview}>
          <Icon type="yulan" className="icon" />
          <div className="text">预览</div>
        </div>
        <Button className="save" size="large" type="primary" ghost onClick={handleSave}>
          保存
        </Button>
        <Button className="publish" size="large" type="primary" icon={<Icon type="fabu" />} onClick={handlePublish}>
          发布
        </Button>
      </div>
      <AppPreviewModal visible={showModal} theme={basicConfig?.theme || "light"} onClose={handleModalClose} />
    </div>
  );
};

export default memo(AppManagerHeader);
