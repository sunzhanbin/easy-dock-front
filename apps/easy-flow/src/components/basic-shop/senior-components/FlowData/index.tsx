import {memo, useState, useEffect, useRef} from "react";
import {Table} from "antd";
import {SelectColumnsItem} from "@type";
import {ConfigMap} from "@components/form-engine";

type TableComponentType = {
  flows: SelectColumnsItem,
  configMap: ConfigMap
}

const TableComponent = (props: TableComponentType) => {
  const {flows, configMap} = props
  const TableName = flows.id
  const dataSource: any = TableName && configMap?.[TableName]?.tableData

  return (
    <div key={TableName}>
        <Table columns={flows.columns} dataSource={dataSource}/>
    </div>
  )
}

export default memo(TableComponent)