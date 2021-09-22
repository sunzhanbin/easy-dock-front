import { memo, FC, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, DatePicker, Table, Popover } from 'antd';
import styles from './index.module.scss';
import { currentNodeItem, Pagination, StartItem } from '../type';
import { getStayTime, getPassedTime, runtimeAxios } from '@/utils';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { dynamicRoutes } from '@/consts/route';
import useMemoCallback from '@common/hooks/use-memo-callback';
import useAppId from '@/hooks/use-app-id';
import { Icon } from '@common/components';

const { RangePicker } = DatePicker;
const { Option } = Select;
const stateList: { key: number; value: string }[] = [
  {
    key: 1,
    value: '进行中',
  },
  {
    key: 2,
    value: '已终止',
  },
  {
    key: 5,
    value: '已驳回',
  },
  {
    key: 4,
    value: '已办结',
  },
  {
    key: 3,
    value: '已撤回',
  },
];

const statusMap: { [k: number]: { className: string; text: string } } = {
  1: {
    className: 'doing',
    text: '进行中',
  },
  2: {
    className: 'stop',
    text: '已终止',
  },
  5: {
    className: 'reject',
    text: '已驳回',
  },
  4: {
    className: 'done',
    text: '已办结',
  },
  3: {
    className: 'recall',
    text: '已撤回',
  },
};

const Start: FC<{}> = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const appId = useAppId();
  const tableRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortDirection, setSortDirection] = useState<'DESC' | 'ASC'>('DESC');
  const [pagination, setPagination] = useState<Pagination>({
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
  });
  const [data, setData] = useState<StartItem[]>([]);
  const renderContent = useMemoCallback((nodes: currentNodeItem[]) => {
    return (
      <div className="nodes">
        {nodes.map(({ currentNode, currentNodeStartTime, currentNodeId }) => (
          <div className="node" key={currentNodeId}>
            <div className="name">{currentNode}</div>
            <div className="stay">{currentNodeStartTime && getStayTime(currentNodeStartTime)}</div>
          </div>
        ))}
      </div>
    );
  });
  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: '15%',
        render(_: string, record: StartItem, index: number) {
          return <div>{index + 1}</div>;
        },
      },
      {
        title: '流程名称',
        dataIndex: 'processName',
        key: 'processName',
        width: '15%',
        render(_: string, record: StartItem) {
          return <div className={styles.name}>{record.processName}</div>;
        },
        onCell(record: StartItem) {
          return {
            onClick() {
              history.push(dynamicRoutes.toStartDetail(record.processInstanceId));
            },
          };
        },
      },
      {
        title: '发起时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: '15%',
        sortDirections: ['ascend' as 'ascend', 'descend' as 'descend', 'ascend' as 'ascend'],
        defaultSortOrder: 'descend' as 'descend',
        sorter: true,
        render(_: string, record: StartItem) {
          const { startTime } = record;
          return <div className={styles.startTime}>{startTime ? getPassedTime(startTime) : ''}</div>;
        },
      },
      {
        title: '当前节点',
        dataIndex: 'currentNode',
        key: 'currentNode',
        width: '15%',
        render(_: string, record: StartItem) {
          const { currentNodes } = record;
          if (!Array.isArray(currentNodes) || currentNodes.length === 0) {
            return null;
          }
          const currentNode = currentNodes[0].currentNode;
          if (currentNodes.length === 1) {
            return <div className={styles.currentNode}>{currentNode}</div>;
          }
          if (currentNodes.length > 1) {
            return (
              <div className={styles.currentNode}>
                <span className={styles.text}>{currentNode}</span>
                <Popover
                  placement="bottom"
                  trigger="click"
                  title={null}
                  content={renderContent(currentNodes)}
                  getPopupContainer={() => tableRef.current as HTMLDivElement}
                >
                  <Icon type="gengduo" className={styles.icon} />
                </Popover>
              </div>
            );
          }
        },
      },
      {
        title: '节点停留',
        dataIndex: 'stayTime',
        key: 'stayTime',
        width: '15%',
        render(_: string, record: StartItem) {
          const { currentNodes } = record;
          if (!Array.isArray(currentNodes) || currentNodes.length === 0) {
            return null;
          }
          const startTime = currentNodes[0].currentNodeStartTime;
          if (currentNodes.length === 1) {
            return <div className={styles.stayTime}>{startTime && getStayTime(startTime)}</div>;
          }
          if (currentNodes.length > 1) {
            return (
              <div className={styles.stayTime}>
                <span>{startTime && getStayTime(startTime)}</span>
                <Popover placement="bottom" trigger="click" title={null} content={renderContent(currentNodes)}>
                  <Icon type="gengduo" className={styles.icon} />
                </Popover>
              </div>
            );
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render(_: string, record: StartItem) {
          const { state } = record;
          const statusObj = statusMap[state];
          return <div className={classNames(styles.status, styles[statusObj.className])}>{statusObj.text}</div>;
        },
      },
    ];
  }, [history]);
  const fetchData = useMemoCallback(
    (pagination: Pagination = { pageSize: 10, current: 1, total: 0, showSizeChanger: true }) => {
      if (!appId) return;

      setLoading(true);
      const formValues = form.getFieldsValue(true);
      const { current: pageIndex, pageSize } = pagination;
      const { flowName = '', state = '', timeRange = [] } = formValues;
      let startTime: number = 0;
      let endTime: number = 0;
      if (timeRange && timeRange[0]) {
        startTime = moment(timeRange[0]._d).valueOf();
      }
      if (timeRange && timeRange[1]) {
        endTime = moment(timeRange[1]._d).valueOf();
      }
      const params: { [K: string]: string | number } = {
        appId,
        pageIndex,
        pageSize,
        sortDirection,
        processName: flowName,
      };
      if (state) {
        params.state = +state;
      }
      if (startTime) {
        params.startTime = startTime;
      }
      if (endTime) {
        params.endTime = endTime;
      }
      runtimeAxios
        .post('/task/myStart', params)
        .then((res) => {
          const list = res.data?.data || [];
          const total = res.data?.recordTotal || 0;
          setPagination((pagination) => ({ ...pagination, total }));
          setData(list);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  );
  const handleKeyUp = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        fetchData();
      }
    },
    [fetchData],
  );
  const handleSearch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  const handleReset = useCallback(() => {
    form.resetFields();
    fetchData();
  }, [form, fetchData]);
  const handleTableChange = useCallback(
    (newPagination, filters, sorter) => {
      sorter.order === 'ascend' ? setSortDirection('ASC') : setSortDirection('DESC');
      setTimeout(() => {
        setPagination((pagination) => {
          fetchData(newPagination);
          return { ...pagination, ...newPagination };
        });
      }, 0);
    },
    [fetchData],
  );

  useEffect(() => {
    appId && fetchData();
  }, [appId, fetchData]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <Form
            form={form}
            layout="inline"
            colon={false}
            name="start_form"
            labelAlign="left"
            labelCol={{ span: 3.5 }}
            initialValues={{}}
          >
            <Form.Item label="流程名称" name="flowName" className="flowName">
              <Input placeholder="请输入" onKeyUp={handleKeyUp} />
            </Form.Item>
            <Form.Item label="状态" name="state" className="state">
              <Select
                allowClear
                placeholder="请选择"
                style={{ width: '100%' }}
                suffixIcon={<Icon type="xiala" />}
                onChange={() => {
                  fetchData();
                }}
              >
                {stateList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="发起时间" name="timeRange" className="startTime">
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
                suffixIcon={<Icon type="riqi" />}
                onChange={() => {
                  fetchData();
                }}
              ></RangePicker>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.operationContainer}>
          <div className={styles.operation}>
            <Button type="primary" ghost className={styles.search} onClick={handleSearch}>
              查询
            </Button>
            <Button ghost className={styles.reset} onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.content} ref={tableRef}>
        <Table
          loading={loading}
          pagination={pagination}
          rowKey="processInstanceId"
          columns={columns}
          dataSource={data}
          onChange={handleTableChange}
        ></Table>
      </div>
    </div>
  );
};
export default memo(Start);
