import { FC, memo } from 'react';
import styled from 'styled-components';
import DesignZone from './design-zone';
import Toolbox from './toolbox';
const WorkbenchContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  background-color: rgb(245, 245, 247);
`;

const FormDesign: FC<{}> = () => {
  return (
    <WorkbenchContainer>
      <Toolbox></Toolbox>
      <DesignZone></DesignZone>
    </WorkbenchContainer>
  );
};

export default memo(FormDesign);
