import React, { useCallback, useMemo } from 'react';
import SelectCard from '@components/select-card';
import {
  useGetProjectListQuery,
  useNewProjectMutation,
  useDeleteProjectMutation,
  useEditProjectMutation,
  useUpdateWorkspaceListMutation,
} from '@/http';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectProjectId, setProjectId, selectUserInfo } from '@views/home/index.slice';
import { message } from 'antd';
import { RoleEnum } from '@utils/types';

const SELECT_CARD_TYPE = {
  key: 'project',
  label: '项目',
};
const ProjectComponent = () => {
  const dispatch = useAppDispatch();
  const { projectList } = useGetProjectListQuery('', {
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
  const handleSelectProject = useCallback(
    (projectId) => {
      dispatch(setProjectId(projectId));
      updateWorkspaceList(projectId);
    },
    [dispatch, updateWorkspaceList],
  );
  const handleNewProject = useCallback(
    ({ name, isEdit, id }) => {
      if (!isEdit) {
        addProject({ name });
        message.success('创建成功');
      } else {
        editProject({ name, id });
        message.success('修改成功');
      }
    },
    [editProject, addProject],
  );
  const handleDeleteProject = useCallback(
    (id: number) => {
      deleteProject(id);
      message.success('删除成功');
    },
    [deleteProject],
  );
  const isAdmin = useMemo(() => {
    const power = userInfo?.power || 0;
    return (power & RoleEnum.ADMIN) === RoleEnum.ADMIN;
  }, [userInfo]);
  return (
    <SelectCard
      type={SELECT_CARD_TYPE}
      list={projectList}
      onSelect={handleSelectProject}
      selectedId={projectId}
      onAdd={handleNewProject}
      onDelete={handleDeleteProject}
      isAdmin={isAdmin}
    />
  );
};

export default ProjectComponent;
