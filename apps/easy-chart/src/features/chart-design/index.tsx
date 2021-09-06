
import { useState,useRef, memo,useEffect } from 'react';
import GridLayout, { Layout, ItemCallback, ItemType } from "react-grid-layout";
import MyCharts from './MyCharts';
import styles from './index.module.scss';
const initLayout:ItemType[] = [
  { i: "a", x: 0, y: 0, w: 12, h: 12, datasource: [5, 20, 36, 10, 10, 20] },
  { i: "b", x: 0, y: 0, w: 12, h: 12, datasource: [36, 5, 20, 10, 10, 10] },
];
const ChartDesign = () => {
  const layoutRef = useRef<HTMLDivElement>(null);
  const [grlayout, setLayout] = useState<ItemType[]>(initLayout);
  const [width, setWidth] = useState<number>(0);
  useEffect(()=>{
    setWidth(layoutRef!.current!.clientWidth)
  },[])
  const onResizeStop:ItemCallback = (layout, oldItem, newItem, placeholder, e, element) => {
    const newgrlayout = grlayout.slice()
    const index = findIndex(newgrlayout, newItem)
    const newObj = { ...newgrlayout[index], ...newItem }
    newgrlayout.splice(index, 1, newObj)
    setLayout(newgrlayout)
  }
  const onDragStop:ItemCallback = (layout, oldItem, newItem, placeholder, e, element) => {
    // const newgrlayout = deepcopy(grlayout)
    const newgrlayout = grlayout.slice()
    const index = findIndex(newgrlayout, newItem)
    const newObj = { ...newgrlayout[index], ...newItem }
    newgrlayout.splice(index, 1, newObj)
    setLayout(newgrlayout)
  }
  const findIndex = (arr:ItemType[], el:Layout) => {
    let flag = -1
    arr.forEach((a, index) => {
      if (a.i === el.i) {
        flag = index
      }
    })
    return flag
  }
  return (
    <div ref={layoutRef} className={styles.container}>
      <GridLayout
        className="layout"
        layout={grlayout}
        cols={24}
        rowHeight={12}
        width={width}
        onResizeStop={onResizeStop}
        onDragStop={onDragStop}
      >
        {
          grlayout.map(v => {
            return (
              <div key={v.i} style={{ background: '#fff' }}>
                <div className={styles.icon_box}>
                  <span className={styles.icon_item}>1</span>
                  <span className={styles.icon_item}>2</span>
                </div>
                <MyCharts data={v.datasource} layout={v} width={width}/>
              </div>
            )
          })
        }
      </GridLayout>
    </div>
  );
}

export default memo(ChartDesign);
