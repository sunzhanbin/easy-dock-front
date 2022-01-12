import { useMemo } from 'react';
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
import useMemoCallback from '@common/hooks/use-memo-callback';

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
  const handleSelectProject = useMemoCallback((projectId) => {
    dispatch(setProjectId(projectId));
    updateWorkspaceList(projectId);
  });
  const handleNewProject = useMemoCallback(async ({ name, isEdit, id }) => {
    if (!isEdit) {
      await addProject({ name }).unwrap();
      message.success('创建成功');
    } else {
      await editProject({ name, id }).unwrap();
      message.success('修改成功');
    }
  });
  const handleDeleteProject = useMemoCallback(async (id: number) => {
    await deleteProject(id).unwrap();
    message.success('删除成功');
  });
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
