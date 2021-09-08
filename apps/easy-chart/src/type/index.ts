export type Category = 'chart' | 'filter' | 'text';
export type FormType = 'input' | 'select' | 'textarea';
export interface MaterialPropItem {
    label: string
    type: FormType
    options?: { label: string, value: string }[]
};
export interface MaterialConfig {  //物料通用属性定义
    id: string   // id  每个物料都有一个独有的id
    category: Category // 物料的大类  chart 图表   filter 过滤器  text 文本
    type: string // 物料的小类  柱状图/折线图。。。
    render: () => JSX.Element   //编辑状态和预览状态所渲染出来的真是组件
    props: { //右侧属性配置
        name: MaterialPropItem   //属性名称
        datasource: MaterialPropItem //数据源
        type: MaterialPropItem // 属性类型
        dimension: MaterialPropItem[] // 维度  
        [k: string]: MaterialPropItem | MaterialPropItem[]

    }
    model: { // 最后所需要的真实数据和配置 可以理解为echarts所需要的options
        options: {
            datasource: {
                fieldName: string
                value: string
            }
        }
    }
};

export interface EditorSchema { //最终需要保存的jsonSchema
    id: string
    category: Category
    type: string
    datasource: any[] //数据
    config: any[] // options配置
};