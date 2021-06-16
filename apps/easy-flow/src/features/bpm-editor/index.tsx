import { FC, memo, useEffect } from 'react';
import { Switch, Route, useRouteMatch, useLocation, useParams } from 'react-router-dom';
import EditorHeader from '@/features/bpm-editor/editor-header';
import FormDesign from './form-design';
import FlowDesign from './flow-design';
import PreviewForm from './preview-form';
import { useAppDispatch } from '@app/hooks';
import { loadComponents } from './form-design/toolbox/toolbox-reducer';
import { axios } from '@/utils';
import { setAppInfo } from './form-design/formdesign-slice';
import styles from './index.module.scss';

const BpmEditor: FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { bpmId } = useParams<{ bpmId: string }>();
  useEffect(() => {
    bpmId &&
      axios.get(`/subapp/${bpmId}`).then((res) => {
        const { name, id, app } = res.data;
        dispatch(setAppInfo({ id, name, appId: app.id }));
      });
  }, [bpmId]);

  useEffect(() => {
    dispatch(loadComponents());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      {location.pathname !== `${match.url}/preview-form` && <EditorHeader></EditorHeader>}

      <div className={styles['bmp-editor-content']}>
        <Switch>
          <Route path={`${match.path}/form-design`} component={FormDesign}></Route>
          <Route path={`${match.path}/flow-design`} component={FlowDesign}></Route>
          <Route path={`${match.path}/preview-form`} component={PreviewForm}></Route>
          {/* <Redirect to={`${match.url}/form-design`}></Redirect> */}
        </Switch>
      </div>
    </div>
  );
};

export default memo(BpmEditor);
