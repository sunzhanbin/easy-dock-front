import { useParams } from "react-router";
// import microApp from "@micro-zoe/micro-app";

const FormMicroPage = () => {
  const { workspaceId } = useParams();

  console.log("表单应用", workspaceId);

  return <div className="content-component"></div>;
};

export default FormMicroPage;
