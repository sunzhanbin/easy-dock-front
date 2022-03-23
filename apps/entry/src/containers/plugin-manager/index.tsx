import React, { memo, useState, useMemo, useEffect, useRef } from "react";
import { Input, Layout, Select, Form, Button, message } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {
  useUpgradePluginsMutation,
  useAddPluginsMutation,
  useEditPluginsMutation,
  useGetGroupsListQuery,
  useLazyGetPluginsListQuery,
  useLazyGetBindingTenantQuery,
  useBatchAssignAuthMutation,
  useSingleAssignAuthMutation,
  useLazyEnablePluginsQuery,
  useLazyOpenVisitPluginsQuery,
  useLazyGetJsonQuery,
} from "@/http";
import { Icon } from "@common/components";
import classnames from "classnames";
import UploadJsonModalComponent from "@containers/plugin-manager/upload-json-modal.component";
import NewPluginsModalComponent from "@containers/plugin-manager/new-plugins-modal-component";
import "@containers/plugin-manager/index.style.scss";
import {
  selectJsonMeta,
  selectPluginsList,
  setPluginsList,
  setBindingTenantList,
  setJSONMeta,
} from "@views/asset-centre/index.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import GroupManageComponent from "@containers/plugin-manager/group-manage-component";
import PluginsListTableComponent from "@containers/plugin-manager/plugins-list-table.component";
import AuthTenantModalComponent from "@containers/plugin-manager/auth-tenant-modal.component";
import CheckJsonModalComponent from "@containers/plugin-manager/check-json-modal.component";
import { TableColumnsProps } from "@utils/types";
import { AssignAuthType } from "@utils/const";
import JsonEditorComponent from "@components/json-editor";

const { Content } = Layout;
const { Option } = Select;

const PluginManager = () => {
  const jsonMeta = useAppSelector(selectJsonMeta);
  const pluginsList = useAppSelector(selectPluginsList);
  const dispatch = useAppDispatch();
  const [getPluginsList, { isLoading }] = useLazyGetPluginsListQuery();
  const [getBindingTenantList] = useLazyGetBindingTenantQuery();
  const [enablePlugins] = useLazyEnablePluginsQuery();
  const [openVisitPlugins] = useLazyOpenVisitPluginsQuery();
  const [getJson] = useLazyGetJsonQuery();
  const [addPlugins] = useAddPluginsMutation();
  const [editPlugins] = useEditPluginsMutation();
  const [batchAssignAuth] = useBatchAssignAuthMutation();
  const [singleAssignAuth] = useSingleAssignAuthMutation();
  const [upgradePlugins] = useUpgradePluginsMutation();
  const { groupList } = useGetGroupsListQuery("", {
    selectFromResult: ({ data }) => ({
      groupList: data,
    }),
  });
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showCheckJsonModal, setShowCheckJsonModal] = useState<boolean>(false);
  const [showTenantModal, setShowTenantModal] = useState<boolean>(false);
  const [currentPlugins, setCurrentPlugins] = useState<TableColumnsProps | null>(null);
  const [selectedRows, setSelectedRows] = useState<TableColumnsProps[]>([]);
  const [assignType, setAssignType] = useState<AssignAuthType>();

  // 查询插件列表
  useEffect(() => {
    getPluginsList({});
  }, [getPluginsList]);

  // 全选、单选
  const rowSelection: any = useMemo(() => {
    return {
      onSelect: (record: TableColumnsProps, selected: boolean, selectedRows: TableColumnsProps[]) => {
        setSelectedRows(selectedRows);
      },
      onSelectAll: (selected: boolean, selectedRows: TableColumnsProps[]) => {
        setSelectedRows(selectedRows);
      },
    };
  }, []);

  // 编辑插件
  const handleEdit = useMemoCallback((columnItem: TableColumnsProps) => {
    setShowAddModal(true);
    setCurrentPlugins(columnItem);
  });

  // 启用禁用插件
  const handleEnable = useMemoCallback(async (columnItem: TableColumnsProps) => {
    try {
      const params = {
        id: columnItem.id,
        flag: !columnItem.enabled,
      };
      await enablePlugins(params).unwrap();
      dispatch(setPluginsList({ pluginsList, columnItem, type: "enabled" }));
      message.success(`${params.flag ? "启用" : "禁用"}成功`);
    } catch (e) {
      console.log(e);
    }
  });

  // 查看json
  const handleCheckJson = useMemoCallback(async (columnItem: TableColumnsProps) => {
    setShowCheckJsonModal(true);
    const result = await getJson(columnItem.code).unwrap();
    editorRef.current?.add(result?.version?.meta);
    // editorRef.current?.expandAll();
  });

  // 取消查看json
  const handleCancelCheckJson = () => {
    setShowCheckJsonModal(false);
  };

  // 公开不公开插件
  const handleOpenVisit = useMemoCallback(async (columnItem: TableColumnsProps) => {
    try {
      const params = {
        id: columnItem.id,
        flag: !columnItem.openVisit,
      };
      await openVisitPlugins(params).unwrap();
      dispatch(setPluginsList({ pluginsList, columnItem, type: "openVisit" }));
      message.success(`插件已${params.flag ? "公开" : "取消公开"}`);
    } catch (e) {
      console.log(e);
    }
  });

  // 升级插件
  const handleUpgrade = useMemoCallback((columnItem: TableColumnsProps) => {
    setShowJsonModal(true);
    setCurrentPlugins(columnItem);
  });

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

  // 取消新增插件
  const handleCancelAdd = useMemoCallback(() => {
    setShowAddModal(false);
    !currentPlugins && setShowJsonModal(true);
    setCurrentPlugins(null);
  });

  // 确认新增插件
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
      dispatch(setJSONMeta({}));
      setShowAddModal(false);
      setShowJsonModal(false);
    } catch (e) {
      console.log(e);
    }
  });

  // 批量授权弹框
  const handleShowTenant = () => {
    if (!selectedRows.length) {
      message.error("请选择要授权的插件！");
      return;
    }
    setAssignType(AssignAuthType.BATCH);
    setShowTenantModal(true);
  };

  // 指定授权弹框
  const handleAssignTenant = useMemoCallback(async (columnItem: TableColumnsProps) => {
    await getBindingTenantList(columnItem.id);
    setAssignType(AssignAuthType.SINGLE);
    setCurrentPlugins(columnItem);
    setShowTenantModal(true);
  });

  // 取消授权
  const handleCancelTenant = useMemoCallback(() => {
    setShowTenantModal(false);
    dispatch(setBindingTenantList([]));
    assignType === AssignAuthType.SINGLE && setCurrentPlugins(null);
  });

  // 确认授权
  const handleConfirmTenant = useMemoCallback(async (projectIds: string[]) => {
    try {
      if (assignType === AssignAuthType.BATCH) {
        const values = {
          projectIds,
          pluginIds: pluginsList.map((item) => item.id),
        };
        await batchAssignAuth(values).unwrap();
      } else {
        const values = {
          projectIds,
          pluginId: currentPlugins?.id,
        };
        await singleAssignAuth(values).unwrap();
        setCurrentPlugins(null);
        dispatch(setBindingTenantList([]));
      }
      message.success("授权成功");
      setShowTenantModal(false);
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <div className="plugin-manager-container">
      <Layout>
        <Content>
          <div className="operation-wrapper">
            <div className="auth-config">
              <div className="title">插件管理</div>
              <span className={classnames(selectedRows.length ? "selected-name" : "")}>
                <Icon type="quanxianshezhi" />
                <span className="text-name" onClick={handleShowTenant}>
                  批量授权
                </span>
              </span>

              {selectedRows.length ? <span className="text-selected">已选{selectedRows.length}</span> : null}
            </div>
            <div className="right-container">
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
                    placeholder="请输入插件名称"
                    allowClear={true}
                    prefix={<Icon type="sousuo" className="search-icon" onClick={handleSearch} />}
                    onChange={handleSearch}
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
          </div>
          <div className="table-container">
            <PluginsListTableComponent
              rowSelection={rowSelection}
              loading={isLoading}
              onEdit={handleEdit}
              onEnable={handleEnable}
              onCheckJson={handleCheckJson}
              onOpenVisit={handleOpenVisit}
              onUpgrade={handleUpgrade}
              onAssignTenant={handleAssignTenant}
              pluginsList={pluginsList}
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
          <AuthTenantModalComponent
            type={assignType}
            visible={showTenantModal}
            onCancel={handleCancelTenant}
            onOK={handleConfirmTenant}
          />
          <CheckJsonModalComponent visible={showCheckJsonModal} onCancel={handleCancelCheckJson}>
            <JsonEditorComponent ref={editorRef} />
          </CheckJsonModalComponent>
        </Content>
      </Layout>
    </div>
  );
};
export default memo(PluginManager);
