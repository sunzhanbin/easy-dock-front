import React, { FC, memo, useCallback } from 'react';
import { Steps, Button } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';
import { useHistory, useRouteMatch, Link } from 'react-router-dom';
import logo from '@assets/logo.png';
const { Step } = Steps;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 100%;
  padding-left: 60px;
  padding-right: 60px;
  border-bottom: 1px solid rgba(24, 31, 67, 0.12);
  .logo {
    margin-right: 24px;
    font-size: 0;
    img {
      height: 42px;
    }
  }
`;

const StepContainer = styled.div``;

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
      <Link to="/" className="logo">
        <img src={logo} alt="logo" />
      </Link>
      <StepContainer>
        <Steps current={current} onChange={onChange}>
          <Step title="表单设计" />
          <Step title="流程设计" />
          <Step title="应用发布" />
        </Steps>
      </StepContainer>
      <Button type="primary" ghost>
        保存
      </Button>
    </HeaderContainer>
  );
};

export default memo(EditorHeader);
