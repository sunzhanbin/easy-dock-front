import { FC, memo } from 'react';
import styled from 'styled-components';

const ToolboxContainer = styled.div`
  width: 275px;
  height: calc(100vh - 157px);
  background: #fff;
`;

const Toolbox: FC<{}> = () => {
  return <ToolboxContainer>这是工具箱</ToolboxContainer>;
};

export default memo(Toolbox);
