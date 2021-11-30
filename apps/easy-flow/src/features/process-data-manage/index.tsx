import { memo, useState, useEffect, useRef, useMemo } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';
import { Select, Form, Checkbox, Table, Tooltip, message, Popover } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd/lib/table';
import { SorterResult } from 'antd/lib/table/interface';
import { SubappShort, AppStatus, SubAppType } from '@type/subapp';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Text } from '@common/components';
import useAppId from '@/hooks/use-app-id';
import { FieldType } from '@type/form';
import { exportFile, runtimeAxios } from '@utils';
import { Icon } from '@common/components';
import StateTag from '@/features/bpm-editor/components/state-tag';
import { TASK_STATE_LIST } from '@/utils/const';
import { omit } from 'lodash';
import styles from './index.module.scss';

const useMock = false;

if (useMock) {
  require('./mock');
}

type FormValue = {
  subappId: number;
  stateList: number[];
  table: {
    pageSize: number;
    current: number;
    total: number;
    sortDirection: 'ASC' | 'DESC';
  };
};

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
    [fieldname: string]: string | string[] | number | number[];
  };
};

const baseServiceUrl = useMock ? '/' : undefined;

const DataManage = () => {
  const appId = useAppId();
  const [subapps, setSubapps] = useState<SubappShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm<FormValue>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<{ name: string; field: string; type: FieldType; defaultValue: string }[]>([]);
  const shouldReFetchFormFields = useRef<boolean>(true);
  const membersCacheRef = useRef<{
    [id: string]: { name: string; avatar?: string; id: number | string };
  }>({});
  const [dataSource, setDataSource] = useState<any[]>();
  const formInititalValue: Omit<FormValue, 'subappId'> = useMemo(() => {
    return {
      stateList: [1, 2, 3, 4, 5, 6],
      table: {
        current: 1,
        pageSize: 10,
        total: 0,
        sortDirection: 'DESC',
      },
    };
  }, []);

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
          return moment(data.startTime).format('YYYY-MM-DD HH:mm');
        },
      },
    ];
  }, []);

  const [tableColumns, setTableColumns] = useState(baseColumns);

  const renderMember = useMemoCallback((member?: number | number[]) => {
    if (!member) return null;
    let text;
    if (Array.isArray(member)) {
      text = member.map((id) => membersCacheRef.current[id].name).join(',');
    } else {
      text = membersCacheRef.current[member]?.name || '';
    }
    return <Text className={styles['dynamic-cell']} text={String(text)} getContainer={false} />;
  });

  const renderDate = useMemoCallback((date: number | [number, number], tableColumn?: any) => {
    if (!date) return null;
    if (tableColumn) {
      tableColumn.width = 180;
    }
    if (Array.isArray(date)) {
      if (tableColumn) {
        tableColumn.width = 360;
      }
      return date.map((ts) => moment(ts).format('YYYY-MM-DD HH:mm:ss')).join('至');
    }
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
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
    return <Text className={styles['dynamic-cell']} text={String(text)} getContainer={false} />;
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
        <div className={styles['pop-container']}>
          <Table dataSource={dataSource} columns={columns} rowKey="key" pagination={false}></Table>
        </div>
      );
    },
  );

  const fetchDatasource = useMemoCallback(async () => {
    setLoading(true);

    try {
      const formValues = form.getFieldsValue();
      const { table, ...others } = formValues;
      let fieldsPromise;

      // 判断是否需要重新拉取表单字段
      if (shouldReFetchFormFields.current) {
        // 同步当前subapp的id
        fieldsPromise = runtimeAxios.get<{ data: typeof fields }>(`/form/subapp/${others.subappId}/all/components`, {
          baseURL: baseServiceUrl,
        });
      }

      const [listResponse, fieldResponse] = await Promise.all([
        runtimeAxios.post(
          `/task/processDataManager/list`,
          {
            pageIndex: table.current,
            pageSize: table.pageSize,
            sortDirection: table.sortDirection,
            ...others,
          },
          { baseURL: baseServiceUrl },
        ),
        fieldsPromise || Promise.resolve(null),
      ]);

      let currentFields = fields;

      if (fieldResponse) {
        shouldReFetchFormFields.current = false;
        // 不展示的控件类型
        const excludeTypeList: string[] = ['Attachment', 'DescText', 'Image', 'FlowData'];
        currentFields = (fieldResponse.data || []).filter((field) => !excludeTypeList.includes(field.type));

        const dynamicColumns: TableProps<TableDataBase>['columns'] = currentFields.map((field) => {
          let tableKey = `formData.${field.field}`;
          let tableColumn: typeof baseColumns[number] = {
            key: tableKey,
            title: <Text className={styles['dynamic-cell']} text={field.name} />,
            dataIndex: tableKey,
            width: 150,
          };
          if (field.type === 'Tabs') {
            tableColumn.render = (_: string, data: TableDataBase) => {
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
                  <div className={styles['tab-detail']}>查看详情</div>
                </Popover>
              );
            };
          } else if (field.type === 'Member') {
            tableColumn.render = (_: string, data: TableDataBase) => {
              const member = data.formData[field.field] || field.defaultValue;
              return renderMember(member as number | number[]);
            };
          } else if (field.type === 'Date') {
            tableColumn.render = (_: string, data: TableDataBase) => {
              const date = data.formData[field.field] || field.defaultValue || '';
              return renderDate(date as number | [number, number], tableColumn);
            };
          } else {
            tableColumn.render = (_: string, data: TableDataBase) => {
              const value = data.formData[field.field] || field.defaultValue || '';
              return renderText(value as string | string[]);
            };
          }

          return tableColumn;
        });

        if (dynamicColumns.length) {
          setTableColumns(() => {
            return baseColumns.concat(dynamicColumns);
          });
        }

        setFields(currentFields);
      }

      const data: TableDataBase[] = listResponse.data?.data || [];

      // 搜集人员字段的值方便后面拉取人员列表
      const ids = new Set<number | string>();
      const fieldsMap = currentFields.reduce((curr, next) => {
        curr[next.field] = next;
        return curr;
      }, {} as { [fieldname: string]: typeof fields[number] });

      data.forEach((item) => {
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
        const userResponse = await runtimeAxios.post(
          '/user/query/owner',
          { userIds: Array.from(Array.from(ids)) },
          { baseURL: baseServiceUrl },
        );

        (userResponse.data.users || []).forEach((user: { id: number; userName: string; avatar?: string }) => {
          membersCacheRef.current[user.id] = {
            id: user.id,
            name: user.userName,
            avatar: user.avatar,
          };
        });
      }

      setDataSource(data);

      form.setFieldsValue({
        table: {
          ...formValues.table,
          total: listResponse.data?.recordTotal || 0,
        },
      });
    } catch (e) {
      console.log(e);

      shouldReFetchFormFields.current = true;
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    setLoading(true);

    runtimeAxios
      .get<{ data: SubappShort[] }>(`/subapp/${appId}/list/all?all=true`, {
        baseURL: baseServiceUrl,
      })
      .then(({ data }) => {
        const subapps = (data || []).filter(
          (subapp) => subapp.status === AppStatus.ON && subapp.type === SubAppType.FLOW,
        );

        setSubapps(subapps);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId]);

  useEffect(() => {
    if (subapps.length) {
      form.setFieldsValue({ subappId: subapps[0].id });

      fetchDatasource();
    }
  }, [subapps, form, fetchDatasource]);

  const handleFormValueChange = useMemoCallback(debounce(fetchDatasource, 300));
  const formatValueFromTable = useMemo(() => {
    return ((pagination: TablePaginationConfig, _, sorter: SorterResult<TableDataBase>) => {
      return {
        pageSize: pagination.pageSize,
        current: pagination.current,
        total: pagination.total,
        sortDirection: sorter.order === 'ascend' ? 'ASC' : 'DESC',
      };
    }) as TableProps<TableDataBase>['onChange'];
  }, []);

  const handleRefresh = useMemoCallback(debounce(fetchDatasource, 200));
  const handleExport = useMemoCallback(() => {
    const { subappId, stateList, table } = form.getFieldsValue();
    const { sortDirection, total } = table;
    if (total > 10000) {
      message.info('当前数据多余10000条,只能导出10000条数据!');
    }
    const params = {
      componentList: fields.map((field) => ({ fieldName: field.field, label: field.name, type: field.type })),
      managerRequest: {
        subappId,
        stateList,
        sortDirection,
      },
    };
    const selectSubApp = subapps.find((subapp) => subapp.id === subappId);
    runtimeAxios.post('/task/processDataManager/export', params, { responseType: 'blob' }).then((res) => {
      const type = (res as any).type;
      exportFile(res, `${selectSubApp?.name || 'file'}.xlsx`, type);
    });
  });

  const handleSubappChange = useMemoCallback(() => {
    shouldReFetchFormFields.current = true;

    form.setFieldsValue(formInititalValue);
  });

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.header}>流程数据管理</div>
      <div className={styles.operation}>
        <div className={styles.export} onClick={handleExport}>
          <Icon type="daochu" className={styles.icon} />
          <span className={styles.text}>导出</span>
        </div>
        <Tooltip title="刷新">
          <div className={styles.refresh} onClick={handleRefresh}>
            <Icon type="chongpao" className={styles.icon} />
          </div>
        </Tooltip>
      </div>
      <Form
        className={styles.form}
        form={form}
        layout="inline"
        onValuesChange={handleFormValueChange}
        initialValues={formInititalValue}
      >
        <Form.Item name="subappId" className={styles['subapp-selector']}>
          <Select
            size="large"
            bordered={false}
            dropdownMatchSelectWidth={false}
            dropdownClassName={styles.dropdown}
            placeholder="请选择子应用"
            disabled={loading}
            getPopupContainer={(c) => c}
            onChange={handleSubappChange}
          >
            {subapps.map((subapp) => (
              <Select.Option key={subapp.id} value={subapp.id}>
                {subapp.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="stateList">
          <Checkbox.Group>
            {TASK_STATE_LIST.map(({ key, value }) => (
              <Checkbox key={key} value={key}>
                {value}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item shouldUpdate={(prevValues, nextValue) => prevValues.table !== nextValue.table} noStyle>
          {(form) => {
            const table = form.getFieldValue('table');
            const pagination = {
              pageSize: Math.max(table.pageSize, dataSource?.length || 0),
              current: table.pageIndex,
              total: table.total,
              showSizeChanger: true,
            };

            const scrollX = tableColumns.reduce((curr, next) => curr + parseInt(String(next.width)), 0);

            return (
              <Form.Item noStyle name="table" getValueFromEvent={formatValueFromTable}>
                <Table
                  loading={loading}
                  className={styles.table}
                  columns={tableColumns}
                  pagination={pagination}
                  dataSource={dataSource}
                  rowKey="processInstanceId"
                  scroll={{ x: scrollX }}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(DataManage);
