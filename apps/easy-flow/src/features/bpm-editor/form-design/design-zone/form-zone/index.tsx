import { FC, memo } from 'react';
import styled from 'styled-components';

const FormZoneContainer = styled.div`
  max-width: 900px;
  width: 100%;
  height: 100%;
  .form-zone {
    background: #fff;
    box-shadow: 0 2px 4px 0 rgb(43 52 65 / 10%);
    min-height: 200px;
    margin-bottom: 30px;
  }
`;

const FormZone: FC<{}> = () => {
  return (
    <FormZoneContainer>
      <div className="form-zone"></div>
    </FormZoneContainer>
  );
};

export default memo(FormZone);
