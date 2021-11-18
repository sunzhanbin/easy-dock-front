import { memo, FC, useState, useRef, useMemo, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Table, Popover } from 'antd';
import styles from './index.module.scss';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { debounce, throttle } from 'lodash';
import { CopyItem, Pagination, UserItem } from '../type';
import { getPassedTime, runtimeAxios, getStayTime } from '@/utils';
import { useAppSelector } from '@/app/hooks';
import { appSelector } from '../taskcenter-slice';
import { useHistory } from 'react-router';
import { dynamicRoutes } from '@/consts';
import moment from 'moment';
import useAppId from '@/hooks/use-app-id';
import StateTag from '@/features/bpm-editor/components/state-tag';

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

const Copy: FC<{}> = () => {
  const [form] = Form.useForm();
  const app = useAppSelector(appSelector);
  const appId = useAppId();
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [optionList, setOptionList] = useState<UserItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>('');
  const pageNumberRef = useRef(1);
  const [pagination, setPagination] = useState<Pagination>({
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
  });
  const [data, setData] = useState<CopyItem[]>([]);
  const [sortDirection, setSortDirection] = useState<'DESC' | 'ASC'>('DESC');
  const tableWrapperContainerRef = useRef<HTMLDivElement>(null);

  const projectId = useMemo(() => {
    if (app && app.project) {
      return app.project.id;
    }
  }, [app]);
  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: '7.5%',
        render(_: string, record: CopyItem, index: number) {
          return <div>{index + 1}</div>;
        },
      },
      {
        title: '流程名称',
        dataIndex: 'processName',
        key: 'processName',
        width: '15%',
        render(_: string, record: CopyItem) {
          return <div className={styles.name}>{record.processName}</div>;
        },
        onCell(data: CopyItem) {
          return {
            onClick() {
              history.push(dynamicRoutes.toStartDetail(data.processInstanceId));
            },
          };
        },
      },
      {
        title: '当前节点',
        dataIndex: 'currentNodeName',
        key: 'currentNodeName',
        width: '15%',
        render(_: string, record: CopyItem) {
          const { currentNodes } = record;

          if (!currentNodes) return null;

          if (currentNodes.length > 1) {
            return (
              <div className={styles.currentNode}>
                <span className={styles.text}>{currentNodes[0].currentNode}</span>
                <Popover
                  placement="bottom"
                  trigger="click"
                  title={null}
                  content={
                    <div className={styles.nodes}>
                      {currentNodes.map(({ currentNode, currentNodeStartTime, currentNodeId }) => (
                        <div className={styles.node} key={currentNodeId}>
                          <div className={styles.name}>{currentNode}</div>
                          <div className={styles.stay}>{currentNodeStartTime && getStayTime(currentNodeStartTime)}</div>
                        </div>
                      ))}
                    </div>
                  }
                  getPopupContainer={() => tableWrapperContainerRef.current!}
                >
                  <Icon type="gengduo" className={styles.icon} />
                </Popover>
              </div>
            );
          } else {
            return <div className={styles.currentNode}>{currentNodes[0].currentNode}</div>;
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render(_: string, record: CopyItem) {
          const { state } = record;
          return <StateTag state={state} />;
        },
      },
      {
        title: '抄送人',
        dataIndex: 'copyUser',
        key: 'copyUser',
        width: '15%',
      },
      {
        title: '抄送时间',
        dataIndex: 'copyTime',
        key: 'copyTime',
        width: '15%',
        sortDirections: ['ascend' as 'ascend', 'descend' as 'descend', 'ascend' as 'ascend'],
        defaultSortOrder: 'descend' as 'descend',
        sorter: true,
        render(_: string, record: CopyItem) {
          const { copyTime } = record;
          return <div className={styles.copyTime}>{copyTime ? getPassedTime(copyTime) : ''}</div>;
        },
      },
    ];
  }, [history]);

  const handleSearch = useMemoCallback(() => {
    fetchData();
  });
  const handleReset = useMemoCallback(() => {});
  const handleScroll = useMemoCallback(
    throttle((event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      // 全部加载完了就不加载了
      if (optionList.length === total) return;

      const container = event.target as HTMLDivElement;

      if (container.scrollHeight - container.offsetHeight - container.scrollTop < 20) {
        if (loading) return;

        fetchOptionList(pageNumberRef.current + 1, keyword);
      }
    }, 300),
  );
  const handleSearchUser = useMemoCallback(
    debounce((val) => {
      setKeyword(val);
      pageNumberRef.current = 1;
      fetchOptionList(1, val);
    }, 500),
  );
  const handleTableChange = useMemoCallback((newPagination, filters, sorter) => {
    sorter.order === 'ascend' ? setSortDirection('ASC') : setSortDirection('DESC');
    setTimeout(() => {
      setPagination((pagination) => {
        fetchData(newPagination);
        return { ...pagination, ...newPagination };
      });
    }, 0);
  });
  const fetchData = useMemoCallback(
    (pagination: Pagination = { pageSize: 10, current: 1, total: 0, showSizeChanger: true }) => {
      if (!appId) return;

      setLoading(true);
      const { current, pageSize } = pagination;
      const formValues = form.getFieldsValue(true);
      const { instanceName = '', starter = '', timeRange = [], state } = formValues;
      let startTime: number = 0;
      let endTime: number = 0;
      if (timeRange && timeRange[0]) {
        startTime = moment(timeRange[0]._d).valueOf();
      }
      if (timeRange && timeRange[1]) {
        endTime = moment(timeRange[1]._d).valueOf();
      }
      const filter: { [k: string]: string | number } = {
        pageIndex: current,
        pageSize,
        starter,
        processName: instanceName,
      };
      if (startTime) {
        filter.startTime = startTime;
      }
      if (endTime) {
        filter.endTime = endTime;
      }
      const params = {
        appId: appId,
        filter,
        sortDirection,
        state,
      };
      runtimeAxios
        .post('/task/copy', params)
        .then((res) => {
          const list = res.data?.data || [];
          const total = res.data?.recordTotal || 0;
          setData(list);
          setPagination((pagination) => ({ ...pagination, total }));
        })
        .finally(() => {
          setLoading(false);
        });
    },
  );
  const fetchOptionList = useMemoCallback((pageNum: number, keyword: string) => {
    if (projectId) {
      runtimeAxios.post('/user/search', { index: pageNum, size: 20, keyword, projectId }).then((res) => {
        const list = res.data?.data || [];
        const total = res.data?.recordTotal;
        const index = res.data?.pageIndex;
        setOptionList((val) => {
          // 从第一页搜索时覆盖原数组
          if (pageNum === 1) {
            return list;
          }
          return val.concat(list);
        });
        // 更新当前页数
        pageNumberRef.current = index;
        setTotal(total);
      });
    }
  });

  useEffect(() => {
    if (projectId) {
      fetchOptionList(1, '');
    }
  }, [fetchOptionList, projectId]);
  useEffect(() => {
    appId && fetchData();
  }, [fetchData, appId]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Form
          form={form}
          layout="inline"
          autoComplete="off"
          colon={false}
          name="copy_form"
          labelAlign="left"
          labelCol={{ span: 3.5 }}
        >
          <div className="copy_form_row">
            <Form.Item
              label="流程名称"
              name="instanceName"
              className="instanceName"
              labelCol={{ style: { width: 66 } }}
            >
              <Input placeholder="请输入" onPressEnter={handleSearch} />
            </Form.Item>
            <Form.Item label="状态" name="state" className="state">
              <Select
                style={{ width: '100%' }}
                placeholder="请选择"
                suffixIcon={<Icon type="xiala" />}
                onChange={handleSearch}
                allowClear
              >
                {stateList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="抄送时间" name="timeRange" className="timeRange" labelCol={{ style: { width: 66 } }}>
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                suffixIcon={<Icon type="riqi" />}
                style={{ width: '100%' }}
                onChange={handleSearch}
              ></RangePicker>
            </Form.Item>
          </div>
          <div className="copy_form_row">
            <Form.Item label="抄送人" name="starter" className="copyUser" labelCol={{ style: { width: 66 } }}>
              <Select
                onPopupScroll={handleScroll}
                onSearch={handleSearchUser}
                onChange={handleSearch}
                style={{ width: '100%' }}
                suffixIcon={<Icon type="xiala" />}
                placeholder="请选择"
                optionFilterProp="label"
                allowClear
                showSearch
              >
                {optionList.map(({ id, userName }) => (
                  <Option key={id} value={id} label={userName}>
                    {userName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="" className="empty"></Form.Item>
            <Form.Item label="" name="operation" className="operation" labelCol={{ style: { width: 66 } }}>
              <div className="btn_list">
                <Button type="primary" ghost className="search" onClick={handleSearch}>
                  查询
                </Button>
                <Button ghost className="reset" onClick={handleReset}>
                  重置
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className={styles.content} ref={tableWrapperContainerRef}>
        <Table
          loading={loading}
          pagination={pagination}
          columns={columns}
          rowKey="processInstanceId"
          dataSource={data}
          onChange={handleTableChange}
        ></Table>
      </div>
    </div>
  );
};

export default memo(Copy);
