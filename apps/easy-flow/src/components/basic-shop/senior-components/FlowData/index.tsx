import {memo, useState, useEffect, useRef} from "react";
import {Table} from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {debounce} from "lodash";
import {SelectColumnsItem} from "@type";
import {ConfigMap} from "@components/form-engine";

type TableComponentType = {
  flows: SelectColumnsItem,
  configMap: ConfigMap
}

const TableComponent = (props: TableComponentType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(400)
  const {flows, configMap} = props
  const TableName = flows.id
  const dataSource: any = TableName && configMap?.[TableName]?.tableData
  console.log(dataSource, 'TableName')
  // const newProps = props?.flows
  console.log(flows, configMap, 'props')
  // const scroll = {y: height}

  return (
    <div key={TableName}>
      <div ref={containerRef}>
        <Table columns={flows.columns} dataSource={dataSource}/>
      </div>
    </div>
  )
}

export default memo(TableComponent)