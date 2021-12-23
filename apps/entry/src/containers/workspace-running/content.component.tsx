import { useParams } from "react-router";
import "@containers/workspace-running/content.style";
// import microApp from "@micro-zoe/micro-app";

const ContentComponent = () => {
  const { workspaceId } = useParams();
  return (
    <div className="content-component">
      <micro-app
        name="react17"
        url={`http://localhost:3002/micro-app/react17`}
        data={{ from: "来自基座的数据" }}
        // onMounted={() => hideLoading(false)}
        // destroy
        // inline
      />
    </div>
  );
};

export default ContentComponent;
