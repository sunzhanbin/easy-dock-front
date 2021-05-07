import { FC, memo, useCallback } from 'react';
import { Steps } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
const { Step } = Steps;

const HeaderContainer = styled.div`
  min-height: 60px;
  width: 100%;
  padding: 30px 60px;
  border-bottom: 1px solid rgba(24, 31, 67, 0.12);
`;

const EditorHeader: FC = () => {
  const match = useRouteMatch();
  const routes = [`${match.url}/form-design`, `${match.url}/flow-design`];
  const history = useHistory();
  const [current, setCurrent] = useState(0);
  const onChange = useCallback((current: number) => {
    setCurrent(current);
    history.push(routes[current]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <HeaderContainer>
      <Steps current={current} onChange={onChange}>
        <Step title="表单设计" />
        <Step title="流程设计" />
        <Step title="应用发布" />
      </Steps>
    </HeaderContainer>
  );
};

export default memo(EditorHeader);
