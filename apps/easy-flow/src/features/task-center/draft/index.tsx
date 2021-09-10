import { memo, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableProps, message, Popconfirm } from 'antd';
import { Icon, PopoverConfirm } from '@common/components';
import { timeDiff } from '@utils';
import { dynamicRoutes } from '@consts';
import { runtimeAxios } from '@utils/axios';
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
  const [draftData, setDraftData] = useState<DraftData[]>([]);
  const handleDeleteDraftData = useMemoCallback(async (draftId: number) => {
    await runtimeAxios.delete(`task/draft/${draftId}`);

    message.success('操作成功');
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
          return timeDiff(Date.now() - data.createTime);
        },
        sorter: (prev, next) => prev.createTime - next.createTime,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '',
        key: 'action',
        width: 100,
        render(_: string, data: DraftData) {
          return (
            <PopoverConfirm
              title={`确认删除${data.subappName}草稿吗？`}
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
  }, [handleDeleteDraftData]);

  useEffect(() => {
    runtimeAxios
      .post(`/task/draft/list`, {
        appId: appId,
        filter: {
          pageIndex: 0,
          pageSize: 10,
          starter: '',
        },
      })
      .then(({ data }) => {
        setDraftData(data?.data || []);
      });
  }, [appId]);

  return <Table className={styles.table} columns={columns} dataSource={draftData} rowKey="subappId" />;
}

export default memo(Draft);
