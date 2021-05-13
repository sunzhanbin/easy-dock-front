import { FC, memo, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import EditorHeader from '@components/editor-header';
import FormDesign from './form-design';
import { useAppDispatch } from '@app/hooks';
import { loadComponents } from './form-design/toolbox-reducer';

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
        <Route path={`${match.path}/form-design`} component={FormDesign}></Route>
        <Route path={`${match.path}`} component={FormDesign}></Route>
      </Switch>
    </>
  );
};

export default memo(BpmEditor);
