import React, { useCallback } from "react";
import SelectCard from "@components/select-card";
import {
  useGetProjectListQuery,
  useNewProjectMutation,
  useDeleteProjectMutation,
  useEditProjectMutation,
} from "@/http";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectProjectId, setProjectId } from "@views/home/index.slice";
import { message } from "antd";

const SELECT_CARD_TYPE = {
  key: "project",
  label: "项目",
};
const ProjectComponent = () => {
  const dispatch = useAppDispatch();
  const { projectList } = useGetProjectListQuery("", {
    selectFromResult: ({ data }) => ({
      projectList: data?.filter(Boolean),
    }),
  });
  const [addProject] = useNewProjectMutation();
  const [editProject] = useEditProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const projectId = useAppSelector(selectProjectId);
  const handleSelectProject = useCallback(
    (projectId) => {
      dispatch(setProjectId(projectId));
    },
    [dispatch]
  );
  const handleNewProject = useCallback(
    ({ name, isEdit, id }) => {
      if (!isEdit) {
        addProject({ name });
        message.success("创建成功");
      } else {
        editProject({ name, id });
        message.success("修改成功");
      }
    },
    [editProject, addProject]
  );
  const handleDeleteProject = useCallback(
    (id: number) => {
      deleteProject(id);
      message.success("删除成功");
    },
    [deleteProject]
  );
  return (
    <SelectCard
      type={SELECT_CARD_TYPE}
      list={projectList}
      onSelect={handleSelectProject}
      selectedId={projectId}
      onAdd={handleNewProject}
      onDelete={handleDeleteProject}
    />
  );
};

export default ProjectComponent;
