import { memo, useState, useEffect } from 'react';
import { Select, Form, Checkbox, Table } from 'antd';
import { debounce } from 'lodash';
import { SubappShort, AppStatus, SubAppType } from '@type/subapp';
import useMemoCallback from '@common/hooks/use-memo-callback';
import useAppId from '@/hooks/use-app-id';
import { runtimeAxios } from '@utils';
import styles from './index.module.scss';

type FormValue = { subappId: number; stateList: number[] };

const columns = [
  {
    key: 'state',
    title: '流程状态',
  },
  {
    key: 'starter',
    title: '发起人',
  },
  {
    key: 'startTime',
    title: '发起时间',
  },
];

const DataManage = () => {
  const [subapps, setSubapps] = useState<SubappShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm<FormValue>();
  const appId = useAppId();

  useEffect(() => {
    setLoading(true);
    runtimeAxios
      .get<{ data: SubappShort[] }>(`/subapp/${appId}/list/all`)
      .then(({ data }) => {
        const subapps = (data || []).filter(
          (subapp) => subapp.status === AppStatus.ON && subapp.type === SubAppType.FLOW,
        );

        setSubapps(subapps);
        if (subapps.length) {
          form.setFieldsValue({ subappId: subapps[0].id });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, form]);

  const handleFormValueChange = useMemoCallback(
    debounce((_, allValues: FormValue) => {
      runtimeAxios.post(`/task/processDataManager/list`, {
        pageIndex: 0,
        pageSize: 0,
        sortDirection: 'DESC',
        ...allValues,
      });
    }, 200),
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>流程数据管理</div>

      <Form className={styles.form} form={form} layout="inline" onValuesChange={handleFormValueChange}>
        <Form.Item name="subappId" className={styles['subapp-selector']}>
          <Select size="large" bordered={false}>
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
            <Checkbox value={4}>已办结</Checkbox>
            <Checkbox value={3}>已撤回</Checkbox>
            <Checkbox value={5}>已驳回</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>

      <Table></Table>
    </div>
  );
};

export default memo(DataManage);
