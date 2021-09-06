
import { useEffect, useRef, useState, FC } from 'react';
import * as echarts from 'echarts';
import { ItemType } from "react-grid-layout";

interface MyChartsType {
    data:number[];
    layout:ItemType;
    width:number
}

const MyCharts:FC<MyChartsType> = (props:MyChartsType) => {
    const { data,layout,width } = props;
    const chartRef = useRef<HTMLDivElement>(null);
    let [myChart, setMyChart] = useState<echarts.ECharts|null>(null);
    useEffect(() => {
        if (!myChart) {
            myChart = echarts.init(chartRef?.current!);
            setMyChart(myChart)
        }
        myChart.setOption({
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data
            }]
        });
    }, [data]);
    useEffect(()=>{
        if(myChart){
            myChart.resize()
        }
    },[layout.x,layout.y,layout.w,layout.h,width])
    return <div style={{ width: '100%', height: '100%' }} ref={chartRef} data-chart='test'></div>
}

export default MyCharts;
