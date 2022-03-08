import React, { memo, useState, useMemo } from "react";
import { Input, Layout, Select, Form, Button, Table, TableProps } from "antd";
import "@containers/plugin-manager/index.style.scss";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";

const { Content } = Layout;
const { Option } = Select;

type TableColumnsProps = {
  name: string;
  enabled: boolean;
  group: string;
  public: boolean;
};
const PluginManager = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const handleSearch = useMemoCallback(() => {
    const values = form.getFieldsValue();
    console.log(values, "value");
  });
  const tableColumns: TableProps<TableColumnsProps>["columns"] = useMemo(() => {
    return [
      {
        key: "state",
        dataIndex: "state",
        title: "插件名称",
        width: 100,
      },
      {
        key: "state",
        dataIndex: "state",
        title: "插件分组",
        width: 100,
      },
      {
        key: "state",
        dataIndex: "state",
        title: "公开",
        width: 100,
      },
      {
        key: "state",
        dataIndex: "state",
        title: "流程状态",
        width: 100,
      },
    ];
  }, []);
  const handleGroupChange = () => {
    console.log(1111);
  };
  const handleAddPlugin = () => {};
  const handleTableChange = () => {};
  return (
    <div className="plugin-manager-container">
      <Layout>
        <Content>
          <div className="operation-wrapper">
            <div className="title">插件管理</div>
            <div className="auth-config">
              <Icon type="quanxianshezhi" />
              <span className="text-name">批量授权</span>
              <span className="text-selected">已选222</span>
            </div>
            <Form form={form} layout="inline">
              <Form.Item name="group">
                <Select
                  size="large"
                  placeholder="请选择插件分组"
                  allowClear
                  onChange={handleGroupChange}
                  suffixIcon={<Icon type="xiala" />}
                >
                  {[].map(({ id, name }: { id: number; name: string }) => (
                    <Option key={id} value={id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="name">
                <Input
                  size="large"
                  bordered={false}
                  className="input"
                  placeholder="请输入插件名称"
                  prefix={<Icon type="sousuo" className="search-icon" onClick={handleSearch} />}
                  onPressEnter={handleSearch}
                />
              </Form.Item>
            </Form>
            <Button type="primary" size="large" className="button" onClick={handleAddPlugin}>
              新建插件
            </Button>
          </div>
          <div className="table-container">
            <Table
              rowKey=""
              loading={loading}
              pagination={false}
              columns={tableColumns}
              dataSource={dataSource}
              onChange={handleTableChange}
            />
          </div>
        </Content>
      </Layout>
    </div>
  );
};
export default memo(PluginManager);
