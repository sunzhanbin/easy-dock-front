import { FC, memo } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import EditorHeader from "@components/editor-header";
import FormDesign from "./form-design";

const SceneEditor: FC = () => {
  const match = useRouteMatch();
  console.log("url " + match.url);
  console.log("path " + match.path);
  return (
    <>
      <EditorHeader></EditorHeader>
      <Switch>
        <Route path={`${match.path}/form-design`} component={FormDesign}></Route>
      </Switch>
    </>
  );
};

export default memo(SceneEditor);
