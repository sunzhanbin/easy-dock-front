import { FC, memo } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import EditorHeader from '@components/editor-header';
import FormDesign from './form-design';

const SceneEditor: FC = () => {
  const match = useRouteMatch();
  return (
    <>
      <EditorHeader></EditorHeader>
      <Switch>
        <Route path={`${match.path}/form-design`} component={FormDesign}></Route>
        <Route path={`${match.path}`} component={FormDesign}></Route>
      </Switch>
    </>
  );
};

export default memo(SceneEditor);
