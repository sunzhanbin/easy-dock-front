import { FC, memo } from 'react';
import styled from 'styled-components';
import FormZone from './form-zone';

const DesignZoneContainer = styled.div`
  padding: 20px;
  height: calc(100vh - 84px);
  overflow: auto;
  display: flex;
  justify-content: center;
  flex: 1;
`;

const DesignZone: FC<{}> = () => {
  return (
    <DesignZoneContainer>
      <FormZone></FormZone>
    </DesignZoneContainer>
  );
};

export default memo(DesignZone);
