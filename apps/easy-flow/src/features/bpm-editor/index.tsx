import { FC, memo, useEffect } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import EditorHeader from '@components/editor-header';
import FormDesign from './form-design';
import { useAppDispatch } from '@app/hooks';
import { loadComponents } from './form-design/toolbox/toolbox-reducer';
import FlowDesign from './flow-design';

const BpmEditor: FC = () => {
  const match = useRouteMatch();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadComponents());
  }, []);

  return (
    <>
      <EditorHeader></EditorHeader>
      <Switch>
        <Route path={`${match.path}form-design`} component={FormDesign}></Route>
        <Route path={`${match.path}flow-design`} component={FlowDesign}></Route>
        <Redirect from="/" to="/form-design"></Redirect>
      </Switch>
    </>
  );
};

export default memo(BpmEditor);
