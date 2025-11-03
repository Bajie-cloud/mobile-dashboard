// 核心业绩数据类型
export interface CorePerformance {
  date: string;
  activeStores: ChangeData;
  totalRevenue: ChangeData;
  avgStoreRevenue: ChangeData;
}

// 渠道分析数据类型
export interface ChannelAnalysis {
  date: string;
  dineInRatio: number;
  takeoutRatio: number;
  dineInTraffic: number;
  dineInTrafficChangeRate: number;
  dineInAvgPrice: number;
  dineInAvgPriceChange: number;
  takeoutOrders: number;
  takeoutOrdersChangeRate: number;
  takeoutAvgPrice: number;
  takeoutAvgPriceChange: number;
}

// 区域分析数据类型
export interface RegionAnalysis {
  date: string;
  regions: Array<{
    name: string;
    revenue: number;
    revenueChangeRate: number;
    storeCount: number;
    avgStoreRevenue: number;
    avgStoreRevenueChangeRate: number;
  }>;
}

// 菜品销售数据类型
export interface ProductSales {
  date: string;
  categories: Array<{
    name: string;
    revenue: number;
    revenueChangeRate: number;
    orderCount: number;
    orderCountChangeRate: number;
    avgPrice: number;
    avgPriceChangeRate: number;
  }>;
  topProducts: Array<{
    name: string;
    revenue: number;
    revenueChangeRate: number;
    orderCount: number;
    orderCountChangeRate: number;
  }>;
}

// 门店排名数据类型
export interface StoreRanking {
  date: string;
  topStores: Array<{
    id: string;
    name: string;
    region: string;
    revenue: number;
    revenueChangeRate: number;
    traffic: number;
    trafficChangeRate: number;
    avgPrice: number;
    avgPriceChangeRate: number;
    rank: number;
    rankChange: number;
  }>;
  performanceTiers: Array<{
    tier: string;
    count: number;
    countChange: number;
    avgRevenue: number;
    avgRevenueChangeRate: number;
    revenueThreshold: number;
  }>;
}

// 异常预警数据类型
export interface AlertRecord {
  id: string;
  type: string;
  level: string;
  title: string;
  description: string;
  storeId: string;
  storeName: string;
  region: string;
  currentValue: number;
  previousValue: number;
  changeRate: number;
  threshold: number;
  timestamp: string;
  status: string;
}

// 门店基础信息类型
export interface Store {
  storeId: string;
  storeName: string;
  regionId: string;
  regionName: string;
  address: string;
  isActive: boolean;
  openDate: string;
}

// 通用响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 图表数据类型
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// 环比数据类型
export interface ChangeData {
  value: number;
  changeRate: number;
  changeValue?: number;
  isPositive: boolean;
}

// 门店详细信息类型
export interface StoreDetail {
  id: string;
  name: string;
  province: string;
  city: string;
  revenue: number;
  address: string;
}

// 区域门店数据类型
export interface RegionStoreData {
  [regionName: string]: StoreDetail[];
}