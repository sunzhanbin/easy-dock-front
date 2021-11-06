import { memo, useState, useEffect, useRef, useMemo } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';
import { Select, Form, Checkbox, Table, Tooltip, message } from 'antd';
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
      stateList: [1, 2, 3, 4, 5],
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
        currentFields = (fieldResponse.data || []).filter((field) => {
          return (
            field.type !== 'Attachment' &&
            field.type !== 'DescText' &&
            field.type !== 'Image' &&
            field.type !== 'Tabs' &&
            field.type !== 'FlowData'
          );
        });

        const dynamicColumns: TableProps<TableDataBase>['columns'] = currentFields.map((field) => {
          let tableKey = `formData.${field.field}`;
          let tableColumn: typeof baseColumns[number] = {
            key: tableKey,
            title: <Text className={styles['dynamic-cell']} text={field.name} />,
            dataIndex: tableKey,
            width: 150,
          };

          if (field.type === 'Member') {
            tableColumn.render = (_: string, data: TableDataBase) => {
              const member = data.formData[field.field] || field.defaultValue;
              if (!member) return null;

              let text;

              if (Array.isArray(member)) {
                text = member.map((id) => membersCacheRef.current[id].name).join(',');
              } else {
                text = membersCacheRef.current[member].name;
              }

              return <Text className={styles['dynamic-cell']} text={String(text)} getContainer={false} />;
            };
          } else if (field.type === 'Date') {
            tableColumn.render = (_: string, data: TableDataBase) => {
              const date = data.formData[field.field] || field.defaultValue || '';

              tableColumn.width = 180;

              if (!date) return null;

              if (Array.isArray(date)) {
                tableColumn.width = 360;

                return date.map((ts) => moment(ts).format('YYYY-MM-DD HH:mm:ss')).join('至');
              }

              return moment(date).format('YYYY-MM-DD HH:mm:ss');
            };
          } else {
            tableColumn.render = (_: string, data: TableDataBase) => {
              const value = data.formData[field.field] || field.defaultValue || '';
              let text;

              if (Array.isArray(value)) {
                text = value.join(',');
              } else {
                text = value;
              }

              return <Text className={styles['dynamic-cell']} text={String(text)} getContainer={false} />;
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
            <Checkbox value={1}>进行中</Checkbox>
            <Checkbox value={2}>已终止</Checkbox>
            <Checkbox value={3}>已撤回</Checkbox>
            <Checkbox value={4}>已办结</Checkbox>
            <Checkbox value={5}>已驳回</Checkbox>
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
