import { FC, memo, useEffect } from 'react';
import { Switch, Route, useRouteMatch, Redirect, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import EditorHeader from '@components/editor-header';
import FormDesign from './form-design';
import FlowDesign from './flow-design';
import PreviewForm from './preview-form';
import { useAppDispatch } from '@app/hooks';
import { loadComponents } from './form-design/toolbox/toolbox-reducer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .bmp-editor-content {
    flex: 1 1 0;
    overflow-y: auto;
  }
`;

const BpmEditor: FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadComponents());
  }, [dispatch]);

  return (
    <Container>
      {location.pathname !== `${match.url}/preview-form` && <EditorHeader></EditorHeader>}

      <div className="bmp-editor-content">
        <Switch>
          <Route path={`${match.path}/form-design`} component={FormDesign}></Route>
          <Route path={`${match.path}/flow-design`} component={FlowDesign}></Route>
          <Route path={`${match.path}preview-form`} component={PreviewForm}></Route>
          <Redirect to={`${match.url}/form-design`}></Redirect>
        </Switch>
      </div>
    </Container>
  );
};

export default memo(BpmEditor);
