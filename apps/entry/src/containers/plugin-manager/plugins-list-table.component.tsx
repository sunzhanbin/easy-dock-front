import React, { memo, useMemo } from "react";
import { Switch, Table, TableProps } from "antd";
import { TableColumnsProps } from "@utils/types";
import { Icon } from "@common/components";
import Popconfirm from "@components/popconfirm";
import classnames from "classnames";

type TableComponentProps = {
  loading: boolean;
  rowSelection: any;
  pluginsList: TableColumnsProps[];
  onEdit: (v: any) => void;
  onEnable: (v: any) => void;
  onOpenVisit: (v: any) => void;
  onCheckJson: (v: any) => void;
  onAssignTenant: (v: any) => void;
  onUpgrade: (v: any) => void;
};
const PluginsListTableComponent = ({
  rowSelection,
  loading,
  pluginsList,
  onEdit,
  onEnable,
  onOpenVisit,
  onCheckJson,
  onAssignTenant,
  onUpgrade,
}: TableComponentProps) => {
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
          return <Switch checked={openVisit} onClick={() => onOpenVisit(data)} />;
        },
      },
      {
        key: "enabled",
        dataIndex: "enabled",
        title: "是否启用",
        render(_, data: TableColumnsProps) {
          const { enabled } = data;
          return enabled ? (
            <Popconfirm
              title="确认禁用"
              content="禁用后，租户将无法再流程面板看到该插件?"
              placement="bottom"
              onConfirm={() => onEnable(data)}
            >
              <Switch checked={enabled} />
            </Popconfirm>
          ) : (
            <Switch checked={enabled} onClick={() => onEnable(data)} />
          );
        },
      },
      {
        key: "operation",
        dataIndex: "operation",
        title: "",
        width: 150,
        render(_, data: TableColumnsProps) {
          const { openVisit } = data;
          return (
            <div className="operation-btn-wrapper">
              <div className="box-placeholder" />
              <div className="box-btn">
                <span title="指定租户" onClick={() => !openVisit && onAssignTenant(data)}>
                  <Icon className={classnames(openVisit ? "not-openVisit" : "")} type="jibenxinxi" />
                </span>
                <span title="升级" onClick={() => onUpgrade(data)}>
                  <Icon type="shengji" />
                </span>
                <span title="编辑插件" onClick={() => onEdit(data)}>
                  <Icon type="bianji" />
                </span>
                <span title="查看json" onClick={() => onCheckJson(data)}>
                  <Icon type="biaoliulanliang" />
                </span>
              </div>
            </div>
          );
        },
      },
    ];
  }, [onOpenVisit, onEnable, onAssignTenant, onUpgrade, onEdit, onCheckJson]);

  const handleRowMouseEvent: any = () => {
    return {
      onMouseEnter: (event: React.MouseEvent) => {
        const target = event.target as HTMLDivElement;
        if (target.parentElement?.classList.contains("ant-table-row")) {
          target.parentElement?.classList.add("table-row-active");
        }
      },
      onMouseLeave: (event: React.MouseEvent) => {
        const target = event.target as HTMLDivElement;
        target.parentElement?.classList.remove("table-row-active");
        target.parentElement?.parentElement?.parentElement?.classList.remove("table-row-active");
      },
    };
  };

  return (
    <Table
      rowKey="id"
      loading={loading}
      pagination={false}
      onRow={handleRowMouseEvent}
      rowSelection={rowSelection}
      columns={tableColumns}
      dataSource={pluginsList}
    />
  );
};

export default memo(PluginsListTableComponent);
