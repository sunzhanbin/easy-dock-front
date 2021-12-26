import { useParams } from "react-router";
import "@containers/workspace-running/content.style";
// import microApp from "@micro-zoe/micro-app";

const ChartMicroPage = () => {
  const { workspaceId } = useParams();

  console.log("报表应用", workspaceId);

  return <div className="content-component"></div>;
};

export default ChartMicroPage;
