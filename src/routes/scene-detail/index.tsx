import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axios } from '@utils';

export default function SceneDetail() {
  const { sceneId } = useParams<{ sceneId: string }>();

  useEffect(() => {
    console.log(sceneId);
    axios.get(`/scene/${sceneId}`).then(({ data }) => {
      console.log(data);
    });
  }, [sceneId]);

  return <h1>Scene</h1>;
}
