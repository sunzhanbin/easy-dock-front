import React, { useCallback } from "react";
import SelectCard from "@components/select-card";
import { useGetProjectListQuery, useNewProjectMutation } from "@/http";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectProjectId, setProjectId } from "@views/home/index.slice";

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

  const projectId = useAppSelector(selectProjectId);
  const handleSelectProject = useCallback(
    (projectId) => {
      dispatch(setProjectId(projectId));
    },
    [dispatch]
  );
  const handleNewProject = useCallback(
    (name: any) => {
      return addProject({ name });
    },
    [addProject]
  );
  return (
    <SelectCard
      type={SELECT_CARD_TYPE}
      list={projectList}
      onSelect={handleSelectProject}
      selectedId={projectId}
      onAdd={handleNewProject}
    />
  );
};

export default ProjectComponent;
