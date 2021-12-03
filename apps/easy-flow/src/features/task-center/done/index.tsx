import { memo, FC, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import { DoneItem, Pagination, UserItem } from '../type';
import { getPassedTime } from '@utils/index';
import { runtimeAxios } from '@/utils';
import moment from 'moment';
import { dynamicRoutes } from '@/consts/route';
import useAppId from '@/hooks/use-app-id';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useAppSelector } from '@/app/hooks';
import { appSelector } from '../taskcenter-slice';
import { Icon } from '@common/components';
import { debounce, throttle } from 'lodash';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Done: FC<{}> = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const appId = useAppId();
  const app = useAppSelector(appSelector);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
  });
  const [data, setData] = useState<DoneItem[]>([]);
  const [optionList, setOptionList] = useState<UserItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>('');
  const pageNumberRef = useRef(1);
  const [sortDirection, setSortDirection] = useState<'DESC' | 'ASC'>('DESC');
  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: '7.5%',
        render(_: string, record: DoneItem, index: number) {
          return <div>{index + 1}</div>;
        },
      },
      {
        title: '流程名称',
        dataIndex: 'processName',
        key: 'processName',
        width: '20%',
        render(_: string, record: DoneItem) {
          return <div className={styles.name}>{record.processName}</div>;
        },
        onCell(record: DoneItem) {
          return {
            onClick() {
              history.push(dynamicRoutes.toTaskDetail(record.taskId));
            },
          };
        },
      },
      {
        title: '发起人',
        dataIndex: 'startUser',
        key: 'startUser',
        width: '20%',
      },
      {
        title: '发起时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: '20%',
        render(_: string, record: DoneItem) {
          const { startTime } = record;
          return <div className={styles.startTime}>{getPassedTime(startTime)}</div>;
        },
      },
      {
        title: '办理时间',
        dataIndex: 'endTime',
        key: 'endTime',
        sortDirections: ['ascend' as 'ascend', 'descend' as 'descend', 'ascend' as 'ascend'],
        defaultSortOrder: 'descend' as 'descend',
        sorter: true,
        width: '20%',
        render(_: string, record: DoneItem) {
          const { endTime } = record;
          return <div className={styles.endTime}>{endTime ? moment(endTime).format('yyyy-MM-dd HH:mm') : ''}</div>;
        },
      },
    ];
  }, [history]);
  const projectId = useMemo(() => {
    if (app && app.project) {
      return app.project.id;
    }
  }, [app]);
  const fetchData = useMemoCallback(
    (pagination: Pagination = { pageSize: 10, current: 1, total: 0, showSizeChanger: true }) => {
      if (!appId) return;

      setLoading(true);
      const { current: pageIndex, pageSize } = pagination;
      const formValues = form.getFieldsValue(true);
      const { name = '', starter = '', timeRange = [] } = formValues;
      let startTime: number = 0;
      let endTime: number = 0;
      if (timeRange && timeRange[0]) {
        startTime = moment(timeRange[0]._d).valueOf();
      }
      if (timeRange && timeRange[1]) {
        endTime = moment(timeRange[1]._d).valueOf();
      }
      const filter: { [k: string]: string | number } = {
        pageIndex,
        pageSize,
        starter,
        processName: name,
      };
      if (startTime) {
        filter.startTime = startTime;
      }
      if (endTime) {
        filter.endTime = endTime;
      }
      const params = {
        appId,
        filter,
        sortDirection,
      };
      runtimeAxios
        .post('/task/done', params)
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
  const fetchOptionList = useCallback(
    (pageNum: number, keyword: string) => {
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
    },
    [projectId],
  );
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
  const handleKeyUp = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        fetchData();
      }
    },
    [fetchData],
  );
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
  const handleReset = useCallback(() => {
    form.resetFields();
    fetchData();
  }, [form, fetchData]);
  useEffect(() => {
    fetchOptionList(1, '');
  }, [fetchOptionList]);
  useEffect(() => {
    appId && fetchData();
  }, [appId, fetchData]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.search}>
          <Form
            form={form}
            layout="inline"
            colon={false}
            name="done_form"
            labelAlign="left"
            labelCol={{ span: 3.5 }}
            initialValues={{}}
          >
            <Form.Item label="流程名称" name="name" className="name">
              <Input placeholder="请输入" onKeyUp={handleKeyUp} />
            </Form.Item>
            <Form.Item label="发起人" name="starter" className="initiator">
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                suffixIcon={<Icon type="xiala" />}
                placeholder="请选择"
                optionFilterProp="label"
                onPopupScroll={handleScroll}
                onSearch={handleSearchUser}
                onChange={() => {
                  fetchData();
                }}
              >
                {optionList.map(({ id, userName }) => (
                  <Option key={id} value={id} label={userName}>
                    {userName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="发起时间" name="timeRange" className="timeRange">
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="yyyy-MM-dd HH:mm"
                suffixIcon={<Icon type="riqi" />}
                style={{ width: '100%' }}
                onChange={() => {
                  fetchData();
                }}
              ></RangePicker>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.operationContainer}>
          <div className={styles.operation}>
            <Button
              type="primary"
              ghost
              className={styles.search}
              onClick={() => {
                fetchData();
              }}
            >
              查询
            </Button>
            <Button ghost className={styles.reset} onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <Table
          loading={loading}
          pagination={pagination}
          rowKey="taskId"
          columns={columns}
          dataSource={data}
          onChange={handleTableChange}
        ></Table>
      </div>
    </div>
  );
};

export default memo(Done);
