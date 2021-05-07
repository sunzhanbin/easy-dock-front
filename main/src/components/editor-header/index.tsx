import { FC, memo, useCallback } from 'react';
import { Steps } from 'antd';
//import styled from "styled-component";
import { useState } from 'react';
import { useHistory } from 'react-router';
const { Step } = Steps;

const routes = ['/scene-editor/form-design', '/scene-editor/flow-design'];

/* const HeaderContainer = styled.div`
  min-height: 60px;
  width: 100%;
`; */

const EditorHeader: FC = () => {
  const history = useHistory();
  const [current, setCurrent] = useState(0);
  const onChange = useCallback((current: number) => {
    setCurrent(current);
    history.push(routes[current]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Steps current={current} onChange={onChange}>
      <Step title="表单设计" />
      <Step title="流程设计" />
      <Step title="应用发布" />
    </Steps>
  );
};

export default memo(EditorHeader);
