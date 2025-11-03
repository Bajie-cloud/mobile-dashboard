import React from 'react';
import { Card, Grid } from 'antd-mobile';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { formatCurrency, formatChangeRate, isPositiveChange } from '../../utils/format';

const CorePerformanceSection: React.FC = () => {
  const { corePerformance } = useDashboardStore();

  if (!corePerformance) {
    return (
      <Card className="mx-3 mb-3" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)' }}>
        <div className="p-4">
          <h2 className="text-base font-semibold mb-3 text-white">核心业绩概览</h2>
          <div className="animate-pulse">
            <div className="h-32 bg-white bg-opacity-20 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }



  // 渲染单个指标卡片
  const renderMetricCard = (title: string, value: number, changeRate?: number, unit?: string, metricId?: string) => {
    const hasChange = changeRate !== undefined;
    const isPositive = hasChange ? isPositiveChange(changeRate) : false;

    return (
      <div 
        className="rounded-2xl shadow-sm p-4 text-center"
        style={{ 
          background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
          border: 'none'
        }}
      >
        <div className="text-sm text-white text-opacity-90 mb-2 text-center">
          <span>{title}</span>
        </div>
        <div className="text-2xl font-bold text-white mb-2">
          {typeof value === 'number' && value >= 10000 ? (
            <>
              {(value / 10000).toFixed(1)}
              <span className="text-sm text-white text-opacity-80 ml-1 font-normal">万</span>
            </>
          ) : (
            <>
              {value.toLocaleString()}
              {unit && <span className="text-sm text-white text-opacity-80 ml-1 font-normal">{unit}</span>}
            </>
          )}
        </div>
        {hasChange && (
          <div className="flex items-center justify-center text-sm text-white text-opacity-90">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>{formatChangeRate(changeRate)}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* 核心业绩概览标题 */}
      <div className="px-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">核心业绩概览</h2>
      </div>
      
      {/* 核心业绩指标卡片 - 3个并排的小卡片 */}
      <div className="mb-3 px-3">
        <Grid columns={3} gap={8}>
          <Grid.Item>
            {renderMetricCard(
              '在营门店数',
              corePerformance.activeStores.value,
              corePerformance.activeStores.changeRate,
              '家',
              'active_stores'
            )}
          </Grid.Item>
          <Grid.Item>
            {renderMetricCard(
              '当日总营业额',
              corePerformance.totalRevenue.value,
              corePerformance.totalRevenue.changeRate,
              undefined,
              'total_revenue'
            )}
          </Grid.Item>
          <Grid.Item>
            {renderMetricCard(
              '日店均营业额',
              corePerformance.avgStoreRevenue.value,
              corePerformance.avgStoreRevenue.changeRate,
              '元',
              'avg_store_revenue'
            )}
          </Grid.Item>
        </Grid>
      </div>

    </div>
  );
};

export default CorePerformanceSection;