import { useEffect, useState } from 'react';
import { builderAxios } from '@utils';
import { SubApp } from '@type/subapp';

export default function useSubapp(subAppId: string) {
  const [data, setData] = useState<SubApp>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    builderAxios
      .get(`/subapp/${subAppId}`)
      .then((apiRes) => {
        setData(apiRes.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [subAppId]);

  return { data, loading };
}
