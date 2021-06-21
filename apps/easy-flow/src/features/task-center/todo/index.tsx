import { memo, useState, FC, useMemo, useCallback, useEffect } from 'react';
import styles from './index.module.scss';
import { Form, Input, Select, Button, DatePicker, Table } from 'antd';
import moment from 'moment';
import { getStayTime } from '@utils/index';
import { runtimeAxios } from '@/utils';
import { useHistory, useLocation } from 'react-router-dom';
import { Pagination, TodoItem, UserItem } from '../type';
import { useAppDispatch } from '@/app/hooks';
import { setTodoNum } from '../taskcenter-slice';
import { dynamicRoutes } from '@/consts/route';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ToDo: FC<{}> = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const appId = useMemo(() => {
    return location.pathname.slice(13, -5);
  }, [location]);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [optionList, setOptionList] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
  });
  const [data, setData] = useState<TodoItem[]>([]);
  const fetchData = useCallback(() => {
    setLoading(true);
    const { current, pageSize } = pagination;
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
      pageIndex: current,
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
    };
    runtimeAxios
      .post('/task/todo', params)
      .then((res) => {
        const list = res.data?.data || [];
        const total = res.data?.recordTotal || 0;
        setData(list);
        setPagination((pagination) => ({ ...pagination, total }));
        dispatch(setTodoNum({ todoNum: total }));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, pagination, form]);
  const fetchOptionList = useCallback(() => {
    runtimeAxios.post('/user/search', { index: 0, size: 100, keyword: '' }).then((res) => {
      const list = res.data?.data || [];
      setOptionList(list);
    });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: '15%',
        render(_: string, record: TodoItem, index: number) {
          return <div>{index + 1}</div>;
        },
      },
      {
        title: '流程名称',
        dataIndex: 'processDefinitionName',
        key: 'processDefinitionName',
        width: '15%',
        render(_: string, record: TodoItem) {
          return <div className={styles.name}>{record.processDefinitionName}</div>;
        },
        onCell(record: TodoItem) {
          return {
            onClick() {
              const url = dynamicRoutes.toFlowDetail(record.taskId);
              history.push(url);
            },
          };
        },
      },
      {
        title: '当前节点',
        dataIndex: 'taskName',
        key: 'taskName',
        width: '15%',
      },
      {
        title: '节点停留',
        dataIndex: 'stay',
        key: 'stay',
        width: '15%',
        render(_: string, record: TodoItem) {
          const { startTime } = record;
          return <div className={styles.stayTime}>{getStayTime(startTime)}</div>;
        },
      },
      {
        title: '发起人',
        dataIndex: 'starter',
        key: 'starter',
        width: '15%',
      },
      {
        title: '发起时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: '15%',
        sortDirections: ['ascend' as 'ascend', 'descend' as 'descend', 'ascend' as 'ascend'],
        defaultSortOrder: 'descend' as 'descend',
        render(_: string, record: TodoItem) {
          const { taskCreateTime } = record;
          return moment(taskCreateTime).format('YYYY-MM-DD HH:mm');
        },
        sorter(rowA: TodoItem, rowB: TodoItem) {
          return rowA.startTime - rowB.startTime;
        },
      },
    ];
  }, []);
  const handleFilterOption = useCallback((inputValue, option) => {
    return option.children.indexOf(inputValue) > -1;
  }, []);
  const handleKeyUp = useCallback((e) => {
    if (e.keyCode === 13) {
      fetchData();
    }
  }, []);
  const handleSearch = useCallback(() => {
    fetchData();
  }, []);
  const handleReset = useCallback(() => {
    form.resetFields();
    fetchData();
  }, [form]);
  const handleTableChange = useCallback((newPagination, filters, sorter) => {
    setPagination((pagination) => ({ ...pagination, ...newPagination }));
  }, []);
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);
  useEffect(() => {
    fetchOptionList();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.search}>
          <Form
            form={form}
            layout="inline"
            colon={false}
            name="todo_form"
            labelAlign="left"
            labelCol={{ span: 3.5 }}
            initialValues={{}}
          >
            <Form.Item label="流程名称" name="name" className="name">
              <Input placeholder="请输入" onKeyUp={handleKeyUp} />
            </Form.Item>
            <Form.Item label="发起人" name="starter" className="starter">
              <Select
                showSearch
                filterOption={handleFilterOption}
                onChange={() => {
                  fetchData();
                }}
                style={{ width: '100%' }}
                placeholder="请选择"
                allowClear
              >
                {optionList.map(({ loginName, userName }) => (
                  <Option key={loginName} value={loginName}>
                    {userName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="发起时间" name="timeRange" className="timeRange">
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
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
            <Button type="primary" ghost className={styles.search} onClick={handleSearch}>
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
          rowKey="processInstanceId"
          columns={columns}
          dataSource={data}
          onChange={handleTableChange}
        ></Table>
      </div>
    </div>
  );
};

export default memo(ToDo);
