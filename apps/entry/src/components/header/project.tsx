import React, { useCallback } from "react";
import SelectCard from "@components/select-card";
import { useGetProjectListQuery } from "@/http";
import { useAppDispatch } from "@/store";
import { setProjectId } from "@views/app-manager/index.slice";

const SELECT_CARD_TYPE = {
  key: "project",
  label: "项目",
};
const ProjectComponent = () => {
  const dispatch = useAppDispatch();

  const { data: projectList } = useGetProjectListQuery("");

  console.log(projectList, "data");
  const handleSelectProject = useCallback(
    (projectId) => {
      dispatch(setProjectId(projectId));
    },
    [dispatch]
  );
  if (!projectList) return null;
  return (
    <SelectCard
      type={SELECT_CARD_TYPE}
      list={projectList}
      onSelect={handleSelectProject}
    />
  );
};

export default ProjectComponent;
