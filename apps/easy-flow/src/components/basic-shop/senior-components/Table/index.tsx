import {memo, useState, useEffect, useRef} from "react";
import {Table} from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {debounce} from "lodash";
import {SelectColumnsItem} from "@type";

type TableComponentType = {
  flows: SelectColumnsItem
}

const TableComponent = (props: TableComponentType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(400)
  const newProps = props?.flows
  console.log(newProps, 'props')
  // const scroll = {y: height}
  const handleResize = useMemoCallback(debounce(() => {
    if (!containerRef || !containerRef.current) {
      return
    }
    const header = containerRef.current.querySelector('.ant-table-header')
    const pagination = containerRef.current.querySelector('.ant-pagination')
    if (!pagination || !header) {
      return
    }
    const {height} = containerRef.current.getBoundingClientRect()
    const {height: headerHeight} = header.getBoundingClientRect()
    const {height: paginationHeight} = pagination.getBoundingClientRect()
    const style: CSSStyleDeclaration = getComputedStyle(pagination)
    console.log(style, 'style')
    const marginTop = parseInt(style['marginTop'].replace(/px/, ''))
    const marginBottom = parseInt(style['marginBottom'].replace(/px/, ''))
    const ret = Math.ceil(height - headerHeight - paginationHeight - marginTop - marginBottom)
    if (ret > 0 && ret !== height) {
      setHeight(ret)
    }
  }, 500))

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)

    };
  }, [height]);

  return (
    <div>
      <div ref={containerRef}>
        <Table {...newProps}/>
      </div>
    </div>
  )
}

export default memo(TableComponent)