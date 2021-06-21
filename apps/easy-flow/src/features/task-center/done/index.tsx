import { memo, FC, useMemo, useState, useCallback, useEffect } from 'react';
import styles from './index.module.scss';
import { Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { DoneItem, Pagination, UserItem } from '../type';
import { getPassedTime } from '@utils/index';
import { runtimeAxios } from '@/utils';
import moment from 'moment';
import { dynamicRoutes } from '@/consts/route';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Done: FC<{}> = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const appId = useMemo(() => {
    return location.pathname.slice(13, -5);
  }, [location]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
  });
  const [data, setData] = useState<DoneItem[]>([]);
  const [optionList, setOptionList] = useState<UserItem[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const filterOptionList = useMemo(() => {
    return optionList.filter((option) => option.userName.indexOf(keyword) > -1);
  }, [optionList, keyword]);
  const options = useMemo(() => {
    const content = filterOptionList.map(({ loginName, userName }) => (
      <Option key={loginName} value={loginName}>
        {userName}
      </Option>
    ));
    return content;
  }, [filterOptionList]);
  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 200,
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
              const url = dynamicRoutes.toFlowDetail(record.taskId);
              history.push(url);
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
        width: '20%',
        render(_: string, record: DoneItem) {
          const { endTime } = record;
          return <div className={styles.endTime}>{endTime ? moment(endTime).format('YYYY-MM-DD HH:mm') : ''}</div>;
        },
      },
    ];
  }, []);
  const fetchData = useCallback(() => {
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
    };
    runtimeAxios
      .post('/task/done', params)
      .then((res) => {
        const list = res.data?.data || [];
        setData(list);
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
  const handleKeyUp = useCallback((e) => {
    if (e.keyCode === 13) {
      fetchData();
    }
  }, []);
  const handleReset = useCallback(() => {
    form.resetFields();
    fetchData();
  }, [form]);
  useEffect(() => {
    fetchData();
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
                // showSearch
                // onSearch={(val) => {
                //   setKeyword(val as string);
                // }}
                allowClear
                style={{ width: '100%' }}
                placeholder="请选择"
                onChange={() => {
                  fetchData();
                }}
              >
                {options}
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
          rowKey="processInstanceId"
          columns={columns}
          dataSource={data}
        ></Table>
      </div>
    </div>
  );
};

export default memo(Done);
