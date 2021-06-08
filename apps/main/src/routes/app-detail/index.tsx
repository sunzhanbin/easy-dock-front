import { memo, FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { axios } from '@/utils';

const Container = styled.div``;

const AppDetail: FC = () => {
  const params: { sceneId: string } = useParams();
  const [subAppList, setSubAppList] = useState<any[]>([]);
  const appId = useMemo(() => params.sceneId, [params]);
  useEffect(() => {
    axios.get(`/subapp/${appId}/list/all`).then((res) => {
      setSubAppList(res.data);
    });
  }, []);
  return <Container>{subAppList.length > 0 ? <div>有子应用</div> : <div>没有子应用</div>}</Container>;
};

export default memo(AppDetail);
