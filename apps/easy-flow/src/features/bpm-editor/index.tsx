import { FC, memo, useEffect } from "react";
import { Switch, Route, useRouteMatch, useParams } from "react-router-dom";
import EditorHeader from "@/features/bpm-editor/editor-header";
import FormDesign from "./form-design";
import FlowDesign from "./flow-design";
import Extend from "./extend";
import { useAppDispatch } from "@app/hooks";
import { loadComponents } from "./form-design/toolbox/toolbox-reducer";
import { axios } from "@/utils";
import { setAppInfo } from "./form-design/formdesign-slice";
import { loadApp } from "@app/app";
import styles from "./index.module.scss";
import useFlowMode from "./flow-design/hooks/use-flow-mode";

const BpmEditor: FC = () => {
  const match = useRouteMatch();
  const dispatch = useAppDispatch();
  const { bpmId } = useParams<{ bpmId: string }>();

  const flowMode = useFlowMode();

  useEffect(() => {
    bpmId &&
      axios.get(`/subapp/${bpmId}`).then((res) => {
        const { name, id, app } = res.data;
        dispatch(setAppInfo({ id, name, appId: app.id }));
      });
  }, [bpmId, dispatch]);

  useEffect(() => {
    if (bpmId) {
      dispatch(loadApp(bpmId));
    }
  }, [bpmId, dispatch]);

  useEffect(() => {
    dispatch(loadComponents());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      {flowMode !== "preview" && <EditorHeader></EditorHeader>}
      <div className={styles["bmp-editor-content"]}>
        <Switch>
          <Route path={`${match.path}/form-design`} component={FormDesign} />
          <Route path={`${match.path}/flow-design`} component={FlowDesign} />
          <Route path={`${match.path}/extend`} component={Extend} />
          {/* <Redirect to={`${match.url}/form-design`}></Redirect> */}
        </Switch>
      </div>
    </div>
  );
};

export default memo(BpmEditor);
