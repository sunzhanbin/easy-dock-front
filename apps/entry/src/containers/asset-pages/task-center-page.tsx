import { useMemo } from 'react';
import { useParams } from 'react-router';
import { FLOW_ENTRY, MAIN_ENTRY } from '@/consts';
import { useWorkspaceDetailQuery } from '@/http/app-manager.hooks';
import '@containers/asset-pages/task-center-page.style';

const TaskCenterMicroPage = () => {
  const { workspaceId } = useParams();
  const { theme } = useWorkspaceDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || 'light',
    }),
  });
  const url = useMemo(() => {
    // const url = `${FLOW_ENTRY}/main/app/${
    // workspaceId || appId
    // }/process/task-center?theme=${theme}&mode=preview&content=true`;
    // return `${FLOW_ENTRY}/task-center/${workspaceId}?mode=running&theme=${theme}`;
    return `${MAIN_ENTRY}/main/app/${workspaceId}/process/task-center?theme=${theme}&mode=running&content=true`;
  }, [theme]);

  return (
    <div className="task-center-page">
      <iframe className="iframe" src={url} frameBorder={0} />
    </div>
  );
};

export default TaskCenterMicroPage;
