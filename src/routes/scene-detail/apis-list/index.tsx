import { useCallback, useEffect, useState } from 'react';
import { axios } from '@utils';
import LoadMore from '@components/load-more';
import styles from './index.module.scss';
import ApiCard, { ApiShape } from './card';

interface ApiListProps {
  value: number[];
  onChange(value: number[]): void;
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
        { baseURL: process.env.REACT_APP_ORCH_DOMAIN },
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
    (id: number, checked: boolean) => {
      if (checked) {
        onChange(value.concat(id));
      } else {
        onChange(value.filter((val) => val !== id));
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
          checked={Boolean(value.find((id) => id === api.id))}
          onChecked={handleValuesChange}
          showRadio
        />
      ))}
    </LoadMore>
  );
}
