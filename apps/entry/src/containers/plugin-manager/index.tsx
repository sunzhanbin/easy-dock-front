import React, { memo, useState, useMemo } from "react";
import { Input, Layout, Select, Form, Button, Table, TableProps, message } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { useAddPluginsMutation, useEditPluginsMutation, useGetPluginsListQuery } from "@/http";
import { Icon } from "@common/components";
import UploadJsonModalComponent from "@containers/plugin-manager/upload-json-modal.component";
import NewPluginsModalComponent from "@containers/plugin-manager/new-plugins-modal.component";
import "@containers/plugin-manager/index.style.scss";
import { selectJsonMeta } from "@views/asset-centre/index.slice";
import { useAppSelector } from "@/store";

const { Content } = Layout;
const { Option } = Select;

type TableColumnsProps = {
  name: string;
  enabled: boolean;
  group: string;
  public: boolean;
};
const PluginManager = () => {
  const jsonMeta = useAppSelector(selectJsonMeta);
  const { pluginsList, isLoading } = useGetPluginsListQuery("", {
    selectFromResult: ({ data, isLoading }) => ({
      pluginsList: data,
      isLoading,
    }),
  });
  const [addPlugins] = useAddPluginsMutation();
  const [editPlugins] = useEditPluginsMutation();
  const [form] = Form.useForm();
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const rowSelection: any = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
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
        title: "是否公开",
        width: 100,
      },
      {
        key: "state",
        dataIndex: "state",
        title: "是否启用",
        width: 100,
      },
      {
        key: "state",
        dataIndex: "state",
        title: "",
        width: 100,
      },
    ];
  }, []);
  const handleGroupChange = () => {
    console.log(1111);
  };
  const handleShowJson = () => {
    setShowJsonModal(true);
  };
  const handleCancelJson = () => {
    setShowJsonModal(false);
  };
  const handleNext = () => {
    console.log(jsonMeta, "jsonMeta");
    if (!jsonMeta?.meta) {
      message.error("请上传json文件！");
      return;
    }
    setShowAddModal(true);
  };
  const handleCancelAdd = () => {
    setShowJsonModal(true);
    setShowAddModal(false);
  };
  const handleConfirmAdd = () => {
    setShowAddModal(false);
    setShowJsonModal(false);
  };
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
            <Button type="primary" size="large" className="button" onClick={handleShowJson}>
              新建插件
            </Button>
          </div>
          <div className="table-container">
            <Table
              rowKey=""
              loading={isLoading}
              pagination={false}
              rowSelection={rowSelection}
              columns={tableColumns}
              dataSource={pluginsList}
              onChange={handleTableChange}
            />
          </div>
          <UploadJsonModalComponent visible={showJsonModal} onCancel={handleCancelJson} onOK={handleNext} />
          <NewPluginsModalComponent visible={showAddModal} onOK={handleConfirmAdd} onCancel={handleCancelAdd} />
        </Content>
      </Layout>
    </div>
  );
};
export default memo(PluginManager);
