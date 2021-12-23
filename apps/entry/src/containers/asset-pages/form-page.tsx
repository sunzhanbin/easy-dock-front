import { useParams } from "react-router";
import "@containers/workspace-running/content.style";
// import microApp from "@micro-zoe/micro-app";

const FormMicroPage = () => {
  const { workspaceId } = useParams();

  console.log("表单应用", workspaceId);

  return (
    <div className="content-component">
      <micro-app
        name="form"
        url={`http://localhost:8084`}
        baseroute={`/workspace/${workspaceId}/form`}
        data={{ from: "来自基座的数据" }}
        // onMounted={() => hideLoading(false)}
        // destroy
        // inline
      />
    </div>
  );
};

export default FormMicroPage;
