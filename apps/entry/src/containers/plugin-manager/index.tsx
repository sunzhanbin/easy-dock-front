import React, { memo, useState, useMemo, useEffect } from "react";
import { Input, Layout, Select, Form, Button, Table, TableProps, message, Switch } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {
  useUpgradePluginsMutation,
  useAddPluginsMutation,
  useEditPluginsMutation,
  useGetGroupsListQuery,
  useLazyGetPluginsListQuery,
} from "@/http";
import { Icon } from "@common/components";
import UploadJsonModalComponent from "@containers/plugin-manager/upload-json-modal.component";
import NewPluginsModalComponent from "@containers/plugin-manager/new-plugins-modal-component";
import "@containers/plugin-manager/index.style.scss";
import { selectJsonMeta, selectPluginsList } from "@views/asset-centre/index.slice";
import { useAppSelector } from "@/store";
import GroupManageComponent from "@containers/plugin-manager/group-manage-component";
import { TableColumnsProps } from "@utils/types";

const { Content } = Layout;
const { Option } = Select;

const PluginManager = () => {
  const jsonMeta = useAppSelector(selectJsonMeta);
  const pluginsList = useAppSelector(selectPluginsList);
  const [getPluginsList, { isLoading }] = useLazyGetPluginsListQuery();
  const [addPlugins] = useAddPluginsMutation();
  const [editPlugins] = useEditPluginsMutation();
  const [upgradePlugins] = useUpgradePluginsMutation();
  const { groupList } = useGetGroupsListQuery("", {
    selectFromResult: ({ data }) => ({
      groupList: data,
    }),
  });
  const [form] = Form.useForm();
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [currentPlugins, setCurrentPlugins] = useState<TableColumnsProps | null>(null);

  useEffect(() => {
    getPluginsList({});
  }, [getPluginsList]);

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

  const handleEdit = useMemoCallback((columnItem: TableColumnsProps) => {
    setShowAddModal(true);
    setCurrentPlugins(columnItem);
  });

  const handleUpgrade = useMemoCallback((columnItem: TableColumnsProps) => {
    setShowJsonModal(true);
    setCurrentPlugins(columnItem);
  });

  const tableColumns: TableProps<TableColumnsProps>["columns"] = useMemo(() => {
    return [
      {
        key: "name",
        dataIndex: "name",
        title: "插件名称",
      },
      {
        key: "state",
        dataIndex: "state",
        title: "插件分组",
        render(_, data: TableColumnsProps) {
          const { group } = data;
          return <span>{group?.name}</span>;
        },
      },
      {
        key: "code",
        dataIndex: "code",
        title: "code",
      },
      {
        key: "openVisit",
        dataIndex: "openVisit",
        title: "是否公开",
        render(_, data: TableColumnsProps) {
          const { openVisit } = data;
          return <Switch defaultChecked={openVisit} />;
        },
      },
      {
        key: "enabled",
        dataIndex: "enabled",
        title: "是否启用",
        render(_, data: TableColumnsProps) {
          const { enabled } = data;
          return <Switch defaultChecked={enabled} />;
        },
      },
      {
        key: "operation",
        dataIndex: "operation",
        title: "",
        width: 150,
        render(_, data: TableColumnsProps) {
          return (
            <div className="operation-btn-wrapper">
              <div className="box-placeholder" />
              <div className="box-btn">
                <span title="指定租户">
                  <Icon type="jibenxinxi" />
                </span>
                <span title="升级">
                  <Icon type="shengji" onClick={() => handleUpgrade(data)} />
                </span>
                <span title="编辑插件" onClick={() => handleEdit(data)}>
                  <Icon type="bianji" />
                </span>
                <span title="查看json">
                  <Icon type="biaoliulanliang" />
                </span>
              </div>
            </div>
          );
        },
      },
    ];
  }, [handleEdit, handleUpgrade]);

  // 搜索查询
  const handleSearch = useMemoCallback(() => {
    const { groupId, name } = form.getFieldsValue();
    getPluginsList({ name, groupId });
  });
  // 选择分组查询
  const handleGroupChange = useMemoCallback(() => {
    const { name, groupId } = form.getFieldsValue();
    getPluginsList({ name, groupId });
  });

  // 上传json弹框显示
  const handleShowJson = useMemoCallback(() => {
    setShowJsonModal(true);
  });
  // 取消上传json
  const handleCancelJson = useMemoCallback(() => {
    setShowJsonModal(false);
    setCurrentPlugins(null);
  });
  // 确认上传json
  const handleNext = useMemoCallback(async () => {
    if (!jsonMeta?.meta) {
      message.error("请上传json文件！");
      return;
    }
    if (currentPlugins) {
      try {
        const values = {
          meta: { ...jsonMeta?.meta },
          id: currentPlugins?.id,
        };
        await upgradePlugins(values).unwrap();
        message.success("升级成功");
        setCurrentPlugins(null);
        setShowJsonModal(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      setShowAddModal(true);
    }
  });
  const handleCancelAdd = useMemoCallback(() => {
    setShowAddModal(false);
    !currentPlugins && setShowJsonModal(true);
    setCurrentPlugins(null);
  });
  const handleConfirmAdd = useMemoCallback(async (values: any) => {
    try {
      if (currentPlugins) {
        await editPlugins(values).unwrap();
        message.success("修改成功");
        setCurrentPlugins(null);
      } else {
        await addPlugins(values).unwrap();
        message.success("新建成功");
      }
      setShowAddModal(false);
      setShowJsonModal(false);
    } catch (e) {
      console.log(e);
    }
  });
  const handleTableChange = () => {};

  const handleRowMouseEvent: any = () => {
    return {
      onMouseEnter: (event: React.MouseEvent) => {
        const target = event.target as HTMLDivElement;
        target.parentElement?.classList.add("table-row-active");
      },
      onMouseLeave: (event: React.MouseEvent) => {
        const target = event.target as HTMLDivElement;
        target.parentElement?.classList.remove("table-row-active");
        target.parentElement?.parentElement?.parentElement?.classList.remove("table-row-active");
      },
    };
  };
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
              <Form.Item name="groupId">
                <Select
                  size="large"
                  placeholder="请选择插件分组"
                  allowClear
                  style={{ width: 200 }}
                  onChange={handleGroupChange}
                  suffixIcon={<Icon type="xiala" />}
                >
                  {groupList?.map(({ id, name }: { id: number; name: string }) => (
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
            {groupList && <GroupManageComponent groupList={groupList} />}
            <Button
              type="primary"
              size="large"
              icon={<Icon type="xinzeng" />}
              className="button"
              onClick={handleShowJson}
            >
              新建插件
            </Button>
          </div>
          <div className="table-container">
            <Table
              rowKey="id"
              loading={isLoading}
              pagination={false}
              onRow={handleRowMouseEvent}
              rowSelection={rowSelection}
              columns={tableColumns}
              dataSource={pluginsList}
              onChange={handleTableChange}
            />
          </div>
          <UploadJsonModalComponent
            visible={showJsonModal}
            editItem={currentPlugins}
            onCancel={handleCancelJson}
            onOK={handleNext}
          />
          {groupList && (
            <NewPluginsModalComponent
              visible={showAddModal}
              editItem={currentPlugins}
              groupList={groupList}
              onOK={handleConfirmAdd}
              onCancel={handleCancelAdd}
            />
          )}
        </Content>
      </Layout>
    </div>
  );
};
export default memo(PluginManager);
