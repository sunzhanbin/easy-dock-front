import React, { useCallback, useEffect } from "react";
import SelectCard from "@components/select-card";
import { useGetProjectListQuery } from "@/http";
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
  const projectId = useAppSelector(selectProjectId);
  const handleSelectProject = useCallback(
    (projectId) => {
      dispatch(setProjectId(projectId));
    },
    [dispatch]
  );

  console.log(projectId);
  return (
    <SelectCard
      type={SELECT_CARD_TYPE}
      list={projectList}
      onSelect={handleSelectProject}
      selectedId={projectId}
    />
  );
};

export default ProjectComponent;
