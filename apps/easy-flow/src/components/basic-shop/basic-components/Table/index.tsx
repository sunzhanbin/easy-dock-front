import { memo, useMemo } from "react";
import { Table as TableComponent } from "antd";

const Table = () => {
  const columns = useMemo(() => {
    return [
      {
        title: "字段一",
        dataIndex: "id",
        key: "id",
        render() {
          return <div></div>;
        },
      },
      {
        title: "字段二",
        dataIndex: "id",
        key: "id",
        render() {
          return <div></div>;
        },
      },
      {
        title: "字段三",
        dataIndex: "id",
        key: "id",
        render() {
          return <div></div>;
        },
      },
    ];
  }, []);
  const dataSource = useMemo(() => {
    return [];
  }, []);
  return <TableComponent columns={columns} dataSource={dataSource} />;
};

export default memo(Table);
