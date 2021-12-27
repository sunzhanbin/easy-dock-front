import { memo, FC, useState, useEffect, useMemo, useRef } from 'react';
import { Button, Checkbox, Tooltip, Table, TableProps, Popover, Select, message } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import { omit, throttle, debounce } from 'lodash';
import { Pagination, ProcessDataManagerParams, SortDirection, TASK_STATE_LIST, UserItem } from '@/consts';
import { Icon, StateTag, Text } from '@common/components';

import useMemoCallback from '@common/hooks/use-memo-callback';
import useSubapp from '@/hooks/use-subapp';
import { runtimeAxios, builderAxios, exportFile, axios } from '@/utils';
import { useHistory, useLocation , useParams } from 'react-router-dom';
import { dynamicRoutes } from '@/consts/route';
import './index.style.scss';



interface FlowAppContentProps {
  id: number;
  appId: number | string;
  projectId: number;
  theme?: string;
  canOperation?: boolean; //是否可操作 预览时不可操作
}
interface TableColumn {
  key: string;
  dataIndex: string;
  title: string;
  width: number;
  render: (_: any, data: any) => React.ReactNode;
}
export type TableDataBase = {
  processInstanceId: string;
  state: 1 | 2 | 3 | 4 | 5;
  starter: string;
  startTime: number;
  formData: {
    [fieldName: string]: string | string[] | number | number[];
  };
};
type FieldItem = {
  name: string;
  field: string;
  type: string;
  defaultValue: string;
  fieldName: string;
};

const { Option } = Select;

const FlowAppContent: FC<FlowAppContentProps> = ({ theme = 'light', canOperation = true }) => {
  const history = useHistory();
  const { subAppId: id } = useParams<any>();

  const { data: subApp } = useSubapp(String(id));

  const projectId = useMemo(() => {
    if (!subApp) {
      return 0;
    }
    return subApp.app?.project?.id || 0;
  }, [subApp]);

  const location = useLocation();

  useEffect(() => {
    console.log('location', location);
  }, [location]);

  useEffect(() => {
    console.log('data::', subApp);
  }, [subApp]);

  const [loading, setLoading] = useState<boolean>(true);
  const [statusList, setStatusList] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [dataSource, setDataSource] = useState<any[]>();
  const [optionList, setOptionList] = useState<UserItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [subAppName, setSubAppName] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const [pagination, setPagination] = useState<Pagination>({
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
  });
  const pageNumberRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const membersCacheRef = useRef<{
    [id: string]: { name: string; avatar?: string; id: number | string };
  }>({});

  const baseColumns: TableProps<TableDataBase>['columns'] = useMemo(() => {
    return [
      {
        key: 'state',
        dataIndex: 'state',
        title: '流程状态',
        width: 100,
        render(_, data: TableDataBase) {
          const { state } = data;
          return <StateTag state={state} />;
        },
      },
      {
        key: 'starter',
        dataIndex: 'starter',
        width: 100,
        title: '发起人',
      },
      {
        key: 'startTime',
        dataIndex: 'startTime',
        title: '发起时间',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        defaultSortOrder: 'descend',
        width: 180,
        render(_, data: TableDataBase) {
          return moment(data.startTime).format('yyyy-MM-DD HH:mm');
        },
      },
    ];
  }, []);
  const [tableColumns, setTableColumns] = useState(baseColumns);
  const [fields, setFields] = useState<FieldItem[]>([]);

  const renderMember = useMemoCallback((member?: number | number[]) => {
    if (!member) return null;
    let text;
    if (Array.isArray(member)) {
      text = member.map((id) => membersCacheRef.current[id].name).join(',');
    } else {
      text = membersCacheRef.current[member]?.name || '';
    }
    return <Text className="dynamic-cell" text={String(text)} getContainer={false} />;
  });

  const renderDate = useMemoCallback((date: number | [number, number]) => {
    if (!date) return null;

    if (Array.isArray(date)) {
      return date.map((ts) => moment(ts).format('yyyy-MM-DD HH:mm:ss')).join('至');
    }
    return moment(date).format('yyyy-MM-DD HH:mm:ss');
  });

  const renderText = useMemoCallback((value: string | string[]) => {
    if (!value) {
      return null;
    }
    let text;
    if (Array.isArray(value)) {
      text = value.join(',');
    } else {
      text = value;
    }
    return <Text className="dynamic-cell" text={String(text)} getContainer={false} />;
  });

  const renderContent = useMemoCallback(
    (data: { [k: string]: any }[], componentList: { field: string; type: string }[]) => {
      const nameMap = data.shift() || {};
      const dataSource = data;
      const columns: TableColumn[] = [];
      componentList.forEach(({ field, type }) => {
        columns.push({
          key: field,
          dataIndex: field,
          title: nameMap[field],
          width: 120,
          render(_, data) {
            if (type === 'Member') {
              const member = data[field];
              return renderMember(member);
            } else if (type === 'Date') {
              const date = data[field];
              return renderDate(date);
            } else {
              const value = data[field];
              return renderText(value);
            }
          },
        });
      });
      return (
        <div className="pop-container">
          <Table dataSource={dataSource} columns={columns} rowKey="key" pagination={false}></Table>
        </div>
      );
    },
  );

  // 获取表格动态的列,源自于流程表单的控件
  const getDynamicColumns = useMemoCallback((currentFields: any[]): TableProps<TableDataBase>['columns'] => {
    return currentFields.map((field) => {
      const tableKey = `formData.${field.field}`;
      const tableColumn: typeof baseColumns[number] = {
        key: tableKey,
        title: <Text className="dynamic-cell" text={field.name} />,
        dataIndex: tableKey,
        width: 150,
      };
      if (field.type === 'Tabs') {
        // eslint-disable-next-line
        tableColumn.render = (_: string, data: TableDataBase) => {
          if (!data?.formData) {
            return null;
          }
          const components = (field as any).components;
          if (!components || components?.length === 0) {
            return null;
          }
          const tabData: any[] = [];
          const nameMap: { [k: string]: string } = {};
          const keyList: string[] = [];
          const componentList: { field: string; type: string }[] = [];
          components.forEach((com: any) => {
            nameMap[com.field] = com.name;
            keyList.push(com.field);
            componentList.push({ field: com.field, type: com.type });
          });
          tabData.push(nameMap);
          let fieldData = data.formData?.[field.field];
          if (!fieldData) {
            return null;
          }
          fieldData = Array.isArray(fieldData) ? fieldData : JSON.parse(fieldData as string);
          const compData = ((fieldData as any[]) || []).map((item) => omit(item, ['__title__']));
          tabData.push(...compData);
          return (
            <Popover
              placement="topLeft"
              trigger="click"
              title={null}
              content={renderContent(tabData, componentList)}
              getPopupContainer={() => containerRef.current as HTMLDivElement}
            >
              <div className="tab-detail">查看详情</div>
            </Popover>
          );
        };
      } else if (field.type === 'Member') {
        tableColumn.render = (_: string, data: TableDataBase) => {
          if (!data?.formData) {
            return null;
          }
          const member = data.formData[field.field] || field.defaultValue;
          return renderMember(member as number | number[]);
        };
      } else if (field.type === 'Date') {
        tableColumn.render = (_: string, data: TableDataBase) => {
          if (!data?.formData) {
            return null;
          }
          const date = data.formData[field.field] || field.defaultValue || '';
          tableColumn.width = Array.isArray(date) ? 360 : 180;
          return renderDate(date as number | [number, number]);
        };
      } else {
        tableColumn.render = (_: string, data: TableDataBase) => {
          if (!data?.formData) {
            return null;
          }
          const value = data.formData[field.field] || field.defaultValue || '';
          return renderText(value as string | string[]);
        };
      }
      return tableColumn;
    });
  });
  // 缓存人员
  const cacheMembers = useMemoCallback(async (data) => {
    // 搜集人员字段的值方便后面拉取人员列表
    const ids = new Set<number>();
    const fieldsMap: { [k: string]: any } = {};
    fields.forEach((field: any) => {
      fields[field.fieldName] = field;
    });

    data.forEach((item: any) => {
      if (!item.formData) {
        return;
      }
      Object.keys(item.formData).forEach((key) => {
        const field = fieldsMap[key];
        if (!field) return;
        if (field.type === 'Member') {
          const mValue = item.formData[key];
          if (Array.isArray(mValue)) {
            mValue.forEach((id) => {
              if (!membersCacheRef.current[id]) {
                ids.add(id);
              }
            });
          } else {
            if (!membersCacheRef.current[mValue]) {
              ids.add(mValue);
            }
          }
        } else if (field.type === 'Tabs') {
          const tabData = item.formData[key];
          const memberKeys = (field as any).components
            .filter((v: { type: string }) => v.type === 'Member')
            .map((v: { field: string }) => v.field);
          if (Array.isArray(tabData)) {
            tabData.forEach((item) => {
              memberKeys?.forEach((key: string) => {
                const mValue = (item as any)[key];
                if (Array.isArray(mValue)) {
                  mValue.forEach((id) => {
                    if (!membersCacheRef.current[id]) {
                      ids.add(id);
                    }
                  });
                } else {
                  if (!membersCacheRef.current[mValue]) {
                    ids.add(mValue);
                  }
                }
              });
            });
          }
        }
      });
    });
    if (ids.size) {
      const params = {
        userIds: Array.from(ids),
      };
      const userResponse = await runtimeAxios.post('/user/query/owner', params);
      (userResponse.data.users || []).forEach((user: { id: number; userName: string; avatar?: string }) => {
        membersCacheRef.current[user.id] = {
          id: user.id,
          name: user.userName,
          avatar: user.avatar,
        };
      });
    }
  });

  const fetchOptionList = useMemoCallback(async (pageNum: number, keyword: string) => {
    if (projectId) {
      const params = {
        size: 20,
        index: pageNum,
        keyword,
        projectId,
      };
      const res = (await runtimeAxios.post('/user/search', params)) as any;
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
    }
  });

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

  const fetchDataSource = useMemoCallback(async () => {
    try {
      setLoading(true);
      const params: ProcessDataManagerParams = {
        sortDirection,
        subappId: id,
        stateList: statusList,
        pageSize: pagination.pageSize,
        pageIndex: pagination.current,
      };
      if (userId) {
        params.startUserId = userId;
      }
      const res = (await runtimeAxios.post(`/task/processDataManager/list`, params)) as { data: any };
      const dataSource = res?.data;
      if (canOperation && Array.isArray(dataSource?.data) && dataSource?.data.length > 0) {
        cacheMembers(dataSource.data);
        setDataSource(dataSource.data);
      }
      const total = dataSource.recordTotal;
      setPagination((pagination) => ({ ...pagination, total }));
    } catch {
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  });

  const handleTableChange = useMemoCallback((newPagination, filters, sorter) => {
    sorter.order === 'ascend' ? setSortDirection(SortDirection.ASC) : setSortDirection(SortDirection.DESC);
    setPagination((pagination) => {
      return { ...pagination, ...newPagination };
    });
  });

  const handleStatusChange = useMemoCallback((list) => {
    setStatusList(list);
  });
  const handleStarterChange = useMemoCallback((id) => {
    setUserId(id);
  });

  const handleJumpToStartFlow = useMemoCallback(() => {
    // window.open(`${FLOW_ENTRY}/app/${appId}/process/start/flow/${id}`);
    const path = dynamicRoutes.toStartFlow(id);
    history.push(path);
  });

  const handleRefresh = useMemoCallback(debounce(fetchDataSource, 200));
  const handleExport = useMemoCallback(async () => {
    const { total } = pagination;
    if (total > 10000) {
      message.info('当前数据多余10000条,只能导出10000条数据!');
      return;
    }
    const params = {
      componentList: fields.map((field) => ({
        fieldName: field.field,
        label: field.name,
        type: field.type,
      })),
      managerRequest: {
        subappId: id,
        stateList: statusList,
        sortDirection,
      },
    };
    axios.post('/task/processDataManager/export', params, { responseType: 'blob' }).then((res) => {
      const type = (res as any).type;
      exportFile(res, `${subAppName || 'file'}.xlsx`, type);
    });
  });

  useEffect(() => {
    (async () => {
      // 流程表单的控件
      const res = (await runtimeAxios.get(`/form/subapp/${id}/all/components`)) as { data: any[] };
      if (Array.isArray(res?.data) && res.data.length > 0) {
        // 不展示的控件类型
        const excludeTypeList: string[] = ['Attachment', 'DescText', 'Image', 'FlowData', 'Iframe'];
        const currentFields = (res.data || []).filter((field) => !excludeTypeList.includes(field.type));
        const dynamicColumns = getDynamicColumns(currentFields);
        if (dynamicColumns?.length) {
          setTableColumns(() => {
            return baseColumns.concat(dynamicColumns);
          });
        }
        setFields(currentFields);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (id) {
      builderAxios
        .get(`/subapp/${id}`)
        .then((res: any) => {
          setSubAppName(res.data?.name);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  useEffect(() => {
    fetchDataSource();
    fetchOptionList(1, '');
  }, [id, projectId]);

  useEffect(() => {
    fetchDataSource();
  }, [statusList, userId, pagination.pageSize, pagination.current, sortDirection]);

  return (
    <div className={classNames('flow-app-content', theme, !canOperation && 'preview')}>
      <div className="start">
        <Button type="primary" size="large" className="button" onClick={handleJumpToStartFlow}>
          发起流程
        </Button>
      </div>
      <div className="header">
        <div className="status-list">
          <Checkbox.Group value={statusList} onChange={handleStatusChange}>
            {TASK_STATE_LIST.map(({ key, value }) => (
              <Checkbox key={key} value={key}>
                {value}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
        <div className="search">
          <Select
            showSearch
            onChange={handleStarterChange}
            onPopupScroll={handleScroll}
            onSearch={handleSearchUser}
            suffixIcon={<Icon type="xiala" />}
            placeholder="请选择发起人"
            optionFilterProp="label"
            className="select"
            size="large"
            allowClear
          >
            {optionList.map(({ id, userName }) => (
              <Option key={id} value={id} label={userName}>
                {userName}
              </Option>
            ))}
          </Select>
        </div>
        <div className="operation">
          <div className="export" onClick={handleExport}>
            <Icon type="daochu" className="icon" />
            <span className="text">导出</span>
          </div>
          <Tooltip title="刷新">
            <div className="refresh" onClick={handleRefresh}>
              <Icon type="chongpao" className="icon" />
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="table-container">
        <Table
          rowKey="processInstanceId"
          loading={loading}
          pagination={pagination}
          columns={tableColumns}
          dataSource={dataSource}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default memo(FlowAppContent);
