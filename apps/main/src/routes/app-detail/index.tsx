import { memo, FC, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { axios } from '@/utils';

const Container = styled.div``;

const AppDetail: FC = () => {
  const params: { sceneId: string } = useParams();
  const appId = useMemo(() => params.sceneId, [params]);
  useEffect(() => {
    axios.get(`/subapp/${appId}/list/all`).then((res) => {
      console.info(res);
    });
  }, []);
  return (
    <Container>
      app应用管理
      <div>1111</div>
    </Container>
  );
};

export default memo(AppDetail);
