import { useMemo } from 'react';
import { useParams } from 'react-router';
import { MAIN_ENTRY } from '@/consts';
import { useWorkspaceRuntimeDetailQuery } from '@/http/app-manager.hooks';
import '@containers/asset-pages/task-center-page.style';

const TaskCenterMicroPage = () => {
  const { workspaceId } = useParams();
  const { theme } = useWorkspaceRuntimeDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
    }),
  });
  const url = useMemo(() => {
    return `${MAIN_ENTRY}/main/instance/${workspaceId}/task-center?theme=${theme}&mode=running`;
  }, [theme]);

  return (
    <div className="task-center-page">
      <iframe className="iframe" src={url} frameBorder={0} />
    </div>
  );
};

export default TaskCenterMicroPage;
