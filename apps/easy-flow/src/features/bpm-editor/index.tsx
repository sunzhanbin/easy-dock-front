import { FC, memo, useEffect } from 'react';
import { Switch, Route, useRouteMatch, Redirect, useLocation } from 'react-router-dom';
import EditorHeader from '@components/editor-header';
import FormDesign from './form-design';
import FlowDesign from './flow-design';
import PreviewForm from './preview-form';
import { useAppDispatch } from '@app/hooks';
import { loadComponents } from './form-design/toolbox/toolbox-reducer';

const BpmEditor: FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadComponents());
  }, []);

  return (
    <>
      {location.pathname !== '/preview-form' && <EditorHeader></EditorHeader>}
      <Switch>
        <Route path={`${match.path}form-design`} component={FormDesign}></Route>
        <Route path={`${match.path}flow-design`} component={FlowDesign}></Route>
        <Route path={`${match.path}preview-form`} component={PreviewForm}></Route>
        <Redirect from="/" to="/form-design"></Redirect>
      </Switch>
    </>
  );
};

export default memo(BpmEditor);
