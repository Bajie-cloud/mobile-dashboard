// 指标定义数据
export interface MetricDefinition {
  id: string;
  name: string;
  definition: string;
  algorithm: string;
  category: string;
}

export const metricDefinitions: MetricDefinition[] = [
  // 核心业绩概览
  {
    id: 'active_stores',
    name: '在营门店数',
    definition: '在某个特定的时间点，正在开门营业、进行正常业务活动的门店的总数量',
    algorithm: '/',
    category: '核心业绩概览'
  },
  {
    id: 'total_revenue',
    name: '当期总营业额',
    definition: '堂食应收和外卖实收金额合计数',
    algorithm: '/',
    category: '核心业绩概览'
  },
  {
    id: 'avg_store_revenue',
    name: '日店均营业额',
    definition: '单店平均日营业额',
    algorithm: '=当期总营业额/在营门店数',
    category: '核心业绩概览'
  },
  
  // 渠道分析
  {
    id: 'channel_ratio',
    name: '堂食外卖比',
    definition: '当期堂食和外卖的结构比',
    algorithm: '堂食占比=堂食应收/当期总营业额\n外卖占比=外卖实收/当期总营业额',
    category: '渠道分析'
  },
  {
    id: 'dine_in_traffic',
    name: '当期堂食客流',
    definition: '堂食的来客数',
    algorithm: '/',
    category: '渠道分析'
  },
  {
    id: 'dine_in_avg_price',
    name: '当期堂食客单价',
    definition: '堂食的平均客单价',
    algorithm: '=当期的堂食总营业额/当期的堂食来客数',
    category: '渠道分析'
  },
  {
    id: 'takeout_orders',
    name: '当期外卖订单数',
    definition: '全外卖平台的有效订单总数',
    algorithm: '/',
    category: '渠道分析'
  },
  {
    id: 'takeout_avg_price',
    name: '当期外卖客单价',
    definition: '全外卖平台实收客单价',
    algorithm: '=当期的外卖总实收营业额/当期的外卖订单数',
    category: '渠道分析'
  },
  
  // 区域分析
  {
    id: 'region_avg_revenue',
    name: '区域门店日店均营业额',
    definition: '各省份平均每家门店的日营业额',
    algorithm: '=某省当期的总营业额/省份内在营门店数',
    category: '区域分析'
  },
  
  // 菜品分析
  {
    id: 'top5_products',
    name: 'top5单品',
    definition: '当期销量排名前5的菜品',
    algorithm: '/',
    category: '菜品分析'
  },
  {
    id: 'top3_combos',
    name: 'top3套餐',
    definition: '当期销量排名前3的套餐',
    algorithm: '/',
    category: '菜品分析'
  },
  
  // 门店梯度表现
  {
    id: 'top10_stores',
    name: 'top10门店',
    definition: '当期营业额（堂食应收+外卖实收）排名前10的门店',
    algorithm: '/',
    category: '门店梯度表现'
  },
  {
    id: 'bottom10_stores',
    name: '末位10门店',
    definition: '当期营业额（堂食应收+外卖实收）排名倒数10位的门店',
    algorithm: '/',
    category: '门店梯度表现'
  },
  
  // 异常预警
  {
    id: 'revenue_drop_alert',
    name: '门店当期总营业额降幅预警',
    definition: '门店当期总营业额环比昨日降幅50%',
    algorithm: '/',
    category: '异常预警'
  },
  {
    id: 'traffic_drop_alert',
    name: '门店当期堂食客流降幅预警',
    definition: '门店当期堂食来客环比昨日降幅50%',
    algorithm: '/',
    category: '异常预警'
  },
  {
    id: 'takeout_orders_drop_alert',
    name: '门店当期外卖订单数降幅预警',
    definition: '门店当期外卖订单数环比昨日降幅50%',
    algorithm: '/',
    category: '异常预警'
  },
  {
    id: 'takeout_ratio_high_alert',
    name: '门店当期外卖实收营业额占比预警（高）',
    definition: '门店当期外卖实收营业额占当期总营业比≥80%',
    algorithm: '/',
    category: '异常预警'
  },
  {
    id: 'takeout_ratio_low_alert',
    name: '门店当期外卖实收营业额占比预警（低）',
    definition: '门店当期外卖实收营业额占当期总营业比在0%至5%范围',
    algorithm: '/',
    category: '异常预警'
  }
];

// 根据指标ID获取指标定义
export const getMetricDefinition = (metricId: string): MetricDefinition | undefined => {
  return metricDefinitions.find(metric => metric.id === metricId);
};

// 根据分类获取指标列表
export const getMetricsByCategory = (category: string): MetricDefinition[] => {
  return metricDefinitions.filter(metric => metric.category === category);
};