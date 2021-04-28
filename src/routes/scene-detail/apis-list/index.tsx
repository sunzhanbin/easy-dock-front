import { useCallback, useEffect, useState } from 'react';
import { axios } from '@utils';
import LoadMore from '@components/load-more';
import styles from './index.module.scss';
import ApiCard, { ApiShape } from './api';
import { envs } from '@consts';

interface ApiListProps {
  value: ApiShape[];
  onChange(value: ApiShape[]): void;
}

export default function ApiList(props: ApiListProps) {
  const { value, onChange } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [apis, setApis] = useState<ApiShape[]>([]);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post(
        `/api/api-orchestration-service-main/interfaceManage/v1/listInfo`,
        {
          pageNum: currentPage,
          pageSize: 30,
        },
        { baseURL: envs.ALGOR_ORCH_BASE_SERVICE_ENDPOINT },
      )
      .then(({ data }) => {
        if (data.pageIndex === currentPage) {
          setApis((apis) => apis.concat(data.data));
          setIsAllLoaded(data.pageTotal === currentPage);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const loadmore = useCallback(() => {
    setLoading(true);
    setCurrentPage((current) => current + 1);
  }, []);

  const handleValuesChange = useCallback(
    (api: ApiShape, checked: boolean) => {
      if (checked) {
        onChange(value.concat(api));
      } else {
        onChange(value.filter((item) => item.id !== api.id));
      }
    },
    [value, onChange],
  );

  return (
    <LoadMore className={styles.list} loading={loading} loadmore={loadmore} done={isAllLoaded}>
      {apis.map((api) => (
        <ApiCard
          className={styles.api}
          key={api.id}
          data={api}
          checked={Boolean(value.find((item) => item.id === api.id))}
          onChecked={handleValuesChange}
          showRadio
        />
      ))}
    </LoadMore>
  );
}
