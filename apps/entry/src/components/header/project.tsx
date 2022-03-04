import React, { useMemo, useState } from "react";
import SelectCard from "@components/select-card";
import {
  useGetProjectListQuery,
  useNewProjectMutation,
  useDeleteProjectMutation,
  useEditProjectMutation,
  useUpdateWorkspaceListMutation,
} from "@/http";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectProjectId, setProjectId, selectUserInfo } from "@views/home/index.slice";
import { message } from "antd";
import { RoleEnum } from "@utils/types";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NewProjectModalComponent from "@components/header/new-project-modal.component";

const SELECT_CARD_TYPE = {
  key: "project",
  label: "项目",
};
const ProjectComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId: param } = useParams();
  const dispatch = useAppDispatch();
  const { projectList } = useGetProjectListQuery("", {
    selectFromResult: ({ data }) => ({
      projectList: data?.filter(Boolean),
    }),
  });
  const [addProject] = useNewProjectMutation();
  const [editProject] = useEditProjectMutation();
  const [updateWorkspaceList] = useUpdateWorkspaceListMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const projectId = useAppSelector(selectProjectId);
  const userInfo = useAppSelector(selectUserInfo);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false); // 判断是否显示新增项目弹框

  const selectedProjectId = useMemo(() => {
    if (location.pathname.startsWith("/app-manager")) {
      return Number(param);
    }
    return projectId;
  }, [location, param, projectId]);
  const handleSelectProject = useMemoCallback((projectId) => {
    dispatch(setProjectId(projectId));
    updateWorkspaceList(projectId)
      .unwrap()
      .then((workspaceList) => {
        if (location.pathname.startsWith("/app-manager")) {
          const workspaceId = workspaceList?.[0]?.id;
          navigate(`/app-manager/project/${projectId}/workspace/${workspaceId}`);
        }
      });
  });
  const handleNewProject = useMemoCallback(async ({ name, id }) => {
    try {
      await editProject({ name, id }).unwrap();
      message.success("修改成功");
    } catch (e) {
      console.log(e);
    }
  });
  const handleDeleteProject = useMemoCallback(async (id: number) => {
    await deleteProject(id).unwrap();
    message.success("删除成功");
  });
  const handleShowProjectModal = () => {
    setShowProjectModal(true);
  };
  // 取消创建项目
  const handleCancelProjectModal = () => {
    setShowProjectModal(false);
  };
  // 创建项目
  const handleSubmitProject = async (values: any) => {
    try {
      await addProject(values).unwrap();
      message.success("创建成功");
      setShowProjectModal(false);
    } catch (e) {
      console.log(e);
    }
  };
  const isAdmin = useMemo(() => {
    const power = userInfo?.power || 0;
    return (power & RoleEnum.ADMIN) === RoleEnum.ADMIN;
  }, [userInfo]);
  return (
    <SelectCard
      type={SELECT_CARD_TYPE}
      list={projectList}
      onSelect={handleSelectProject}
      selectedId={selectedProjectId}
      onAdd={handleNewProject}
      onShowProjectModal={handleShowProjectModal}
      onDelete={handleDeleteProject}
      isAdmin={isAdmin}
    >
      <NewProjectModalComponent
        onCancel={handleCancelProjectModal}
        visible={showProjectModal}
        onOk={handleSubmitProject}
      />
    </SelectCard>
  );
};

export default ProjectComponent;
