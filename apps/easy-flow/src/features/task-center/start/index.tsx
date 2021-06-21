import { memo, FC, useState, useMemo, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, Table } from 'antd';
import styles from './index.module.scss';
import { Pagination, StartItem } from '../type';
import { getStayTime, getPassedTime } from '@/utils';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { runtimeAxios } from '@/utils';
import moment from 'moment';
import { dynamicRoutes } from '@/consts/route';

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
    key: 3,
    value: '已驳回',
  },
  {
    key: 4,
    value: '已办结',
  },
  {
    key: 5,
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
  3: {
    className: 'reject',
    text: '已驳回',
  },
  4: {
    className: 'done',
    text: '已办结',
  },
  5: {
    className: 'recall',
    text: '已撤回',
  },
};

const Start: FC<{}> = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const appId = useMemo(() => {
    return location.pathname.slice(13, -6);
  }, [location]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
  });
  const [data, setData] = useState<StartItem[]>([]);
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
              const url = dynamicRoutes.toFlowDetail(record.processInstanceId);
              history.push(url);
            },
          };
        },
      },
      {
        title: '发起时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: '15%',
        render(_: string, record: StartItem) {
          const { startTime } = record;
          return <div className={styles.startTime}>{getPassedTime(startTime)}</div>;
        },
      },
      {
        title: '当前节点',
        dataIndex: 'currentNode',
        key: 'currentNode',
        width: '15%',
      },
      {
        title: '节点停留',
        dataIndex: 'stayTime',
        key: 'stayTime',
        width: '15%',
        render(_: string, record: StartItem) {
          const { startTime } = record;
          return <div className={styles.stayTime}>{getStayTime(startTime)}</div>;
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
  }, []);
  const fetchData = useCallback(() => {
    setLoading(true);
    const { pageSize, current: pageIndex } = pagination;
    const formValues = form.getFieldsValue(true);
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
        setData(list);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, pagination, form, setLoading, setData]);
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
  useEffect(() => {
    fetchData();
  }, []);
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
                style={{ width: '100%' }}
                onClear={() => {
                  form.setFieldsValue(Object.assign(form.getFieldsValue(), { state: undefined }));
                  fetchData();
                }}
                onClick={() => {
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
        ></Table>
      </div>
    </div>
  );
};
export default memo(Start);
