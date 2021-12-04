import { useParams } from "react-router";
import "@containers/workspace-running/content.style";

const ContentComponent = () => {
  const { workspaceId } = useParams();
  return (
    <div className="content-component">
      这里是内容展示区域:当前应用ID: {workspaceId}
    </div>
  );
};

export default ContentComponent;
