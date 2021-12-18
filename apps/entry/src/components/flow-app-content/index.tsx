import { memo, FC, useState, useEffect, useMemo, useRef } from "react";
import { Button, Checkbox, Tooltip, Input, Table, TableProps } from "antd";
import moment from "moment";
import { TASK_STATE_LIST } from "@/consts";
import { Icon, StateTag } from "@common/components";
import "./index.style.scss";
import { useFetchFlowComponentsMutation } from "@/http";

interface FlowAppContentProps {
  id: number;
  canOperation?: boolean; //是否可操作 预览时不可操作
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
};

const FlowAppContent: FC<FlowAppContentProps> = ({
  id,
  canOperation = false,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [statusList, setStatusList] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [dataSource, setDataSource] = useState<any[]>();
  const containerRef = useRef<HTMLDivElement>(null);

  const baseColumns: TableProps<TableDataBase>["columns"] = useMemo(() => {
    return [
      {
        key: "state",
        dataIndex: "state",
        title: "流程状态",
        width: 100,
        render(_, data: TableDataBase) {
          const { state } = data;
          return <StateTag state={state} />;
        },
      },
      {
        key: "starter",
        dataIndex: "starter",
        width: 100,
        title: "发起人",
      },
      {
        key: "startTime",
        dataIndex: "startTime",
        title: "发起时间",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        defaultSortOrder: "descend",
        width: 180,
        render(_, data: TableDataBase) {
          return moment(data.startTime).format("yyyy-MM-DD HH:mm");
        },
      },
    ];
  }, []);

  const [tableColumns, setTableColumns] = useState(baseColumns);
  const [fields, setFields] = useState<FieldItem[]>([]);

  const [fetchFlowComponents] = useFetchFlowComponentsMutation();

  useEffect(() => {
    (async () => {
      const components = await fetchFlowComponents(id);
      console.info(components);
    })();
  }, [id]);

  return (
    <div className="flow-app-content">
      <div className="start">
        <Button type="primary" size="large" className="button">
          发起流程
        </Button>
      </div>
      <div className="header">
        <div className="status-list">
          <Checkbox.Group value={statusList}>
            {TASK_STATE_LIST.map(({ key, value }) => (
              <Checkbox key={key} value={key}>
                {value}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
        <div className="search">
          <Input size="large" placeholder="发起人" className="input" />
        </div>
        <div className="operation">
          <div className="export">
            <Icon type="daochu" className="icon" />
            <span className="text">导出</span>
          </div>
          <Tooltip title="刷新">
            <div className="refresh">
              <Icon type="chongpao" className="icon" />
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="table-container">
        <Table columns={tableColumns} dataSource={dataSource} />
      </div>
    </div>
  );
};

export default memo(FlowAppContent);
