
const BarChart = {
  editData: [
    {
      key: 'title',
      name: '标题',
      type: 'Text',
    },
    {
      key: 'size',
      name: '标题大小',
      type: 'Number',
    },
    {
      key: 'color',
      name: '标题颜色6666666666',
      type: 'Color',
    },
    {
      key: 'paddingTop',
      name: '上边距',
      type: 'Number',
    },
    {
      key: 'data',
      name: '数据源',
      type: 'Table',
    },
  ],
  config: {
    title: '柱状图',
    size: 14,
    color: 'rgba(0,0,0,1)',
    paddingTop: 10,
    data: [
      {
        name: 'A',
        value: 20,
      },
      {
        name: 'B',
        value: 60,
      },
      {
        name: 'C',
        value: 20,
      },
    ],
  },
};

export default BarChart;
