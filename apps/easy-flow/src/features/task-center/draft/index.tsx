import { memo, useEffect, useState, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Table, TableProps, message } from 'antd';
import classNames from 'classnames';
import { TablePaginationConfig } from 'antd/lib/table';
import { debounce } from 'lodash';
import { Icon, PopoverConfirm } from '@common/components';
import { timeDiff } from '@utils';
import { dynamicRoutes } from '@consts';
import { runtimeAxios } from '@utils/axios';
import { deleteDraft } from '@apis/detail';
import useMemoCallback from '@common/hooks/use-memo-callback';
import useAppId from '@/hooks/use-app-id';
import styles from './index.module.scss';

interface DraftData {
  subappName: string;
  subappId: number;
  createTime: number;
  user: {
    avatar?: string;
    id: number | string;
    name: string;
  };
}

function Draft() {
  const appId = useAppId();
  const location = useLocation();
  const theme = useMemo<string>(() => {
    // 以iframe方式接入,参数在location中
    if (location.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get('theme') || 'light';
    }
    return 'light';
  }, [location.search]);
  const [draftData, setDraftData] = useState<DraftData[]>([]);
  const [activeDataId, setActiveDataId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const handleDeleteDraftData = useMemoCallback(async (draftId: number) => {
    await deleteDraft(draftId);

    fetchDraftData();
    message.success('操作成功');
  });
  const paginationRef = useRef<TablePaginationConfig>({
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
  });
  const columns: TableProps<DraftData>['columns'] = useMemo(() => {
    return [
      {
        title: '流程名称',
        dataIndex: 'subappName',
        key: 'subappName',
        width: '30%',
        render(_: string, data: DraftData) {
          return (
            <Link className={styles.link} to={dynamicRoutes.toStartFlow(data.subappId)}>
              {data.subappName}
            </Link>
          );
        },
      },
      {
        title: '操作人',
        dataIndex: 'user',
        key: 'user',
        width: '30%',
        render(_: string, data: DraftData) {
          return data.user.name;
        },
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '30%',
        render(_: string, data: DraftData) {
          if (Date.now() - data.createTime < 60 * 1000) {
            return '刚刚';
          }

          return timeDiff(Math.max(Date.now() - data.createTime, 0));
        },
        // sorter: (prev, next) => next.createTime - prev.createTime,
        // sortDirections: ['descend', 'ascend'],
        // defaultSortOrder: 'ascend',
      },
      {
        title: '',
        key: 'action',
        width: 100,
        render(_: string, data: DraftData) {
          if (data.subappId !== activeDataId) return null;

          return (
            <PopoverConfirm
              title={`确认删除`}
              content={`确认删除${data.subappName}草稿吗？`}
              placement="left"
              onConfirm={() => handleDeleteDraftData(data.subappId)}
            >
              <div className={styles.del}>
                <Icon className={styles.icon} type="shanchu"></Icon>
              </div>
            </PopoverConfirm>
          );
        },
      },
    ];
  }, [handleDeleteDraftData, activeDataId]);

  const fetchDraftData = useMemoCallback(() => {
    setLoading(true);

    const data = paginationRef.current;

    runtimeAxios
      .post(`/task/draft/list`, {
        appId: appId,
        filter: {
          pageIndex: data.current || 1,
          pageSize: data.pageSize || 10,
          starter: '',
        },
      })
      .then(({ data }) => {
        paginationRef.current.total = data?.recordTotal || 0;
        setDraftData(data?.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  useEffect(() => {
    fetchDraftData();
  }, [fetchDraftData]);

  const onRowEvent = useMemo(() => {
    return (data: DraftData) => {
      return {
        onMouseEnter() {
          setActiveDataId(data.subappId);
        },
        onMouseLeave() {
          setActiveDataId(undefined);
        },
      };
    };
  }, []);

  const handleTableConfigChange = useMemoCallback(
    debounce((page: TablePaginationConfig) => {
      paginationRef.current = page;

      fetchDraftData();
    }, 200),
  );

  return (
    <Table
      className={classNames(styles.table, styles[theme])}
      columns={columns}
      dataSource={draftData}
      rowKey="subappId"
      onRow={onRowEvent}
      loading={loading}
      pagination={paginationRef.current}
      onChange={handleTableConfigChange}
    />
  );
}

export default memo(Draft);
