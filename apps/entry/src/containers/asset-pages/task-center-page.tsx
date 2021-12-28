import { useMemo } from "react";
import { useParams } from "react-router";
import { FLOW_ENTRY } from "@/consts";
import "@containers/asset-pages/task-center-page.style";

const TaskCenterMicroPage = () => {
  const { workspaceId } = useParams();
  const url = useMemo(() => {
    return `${FLOW_ENTRY}/task-center/${workspaceId}?mode=preview`;
  }, []);

  return (
    <div className="task-center-page">
      <iframe className="iframe" src={url} frameBorder={0} />
    </div>
  );
};

export default TaskCenterMicroPage;
