import React from 'react';
import { Card, Grid } from 'antd-mobile';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { formatChangeRate, isPositiveChange } from '../../utils/format';

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

  // 渲染单个指标卡片（自适应字体与不换行）
  const renderMetricCard = (title: string, value: number, changeRate?: number, unit?: string) => {
    const hasChange = changeRate !== undefined;
    const isPositive = hasChange ? isPositiveChange(changeRate) : false;

    // 根据标题选择渐变背景色，参考示例图
    const gradient =
      title === '在营门店数'
        ? 'linear-gradient(135deg, #B45309 0%, #D97706 100%)' // 棕橙
        : title === '当期总营业额'
        ? 'linear-gradient(135deg, #9A7B0A 0%, #C49A0A 100%)' // 金棕
        : 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'; // 亮黄

    return (
      <div
        className="rounded-2xl shadow-md p-3 text-center min-w-0"
        style={{ background: gradient, border: 'none' }}
      >
        <div
          className="text-white text-center whitespace-nowrap"
          style={{ fontSize: 'clamp(10px, 2.8vw, 16px)', opacity: 0.95 }}
        >
          <span>{title}</span>
        </div>
        <div
          className="font-bold text-white whitespace-nowrap"
          style={{ fontSize: 'clamp(18px, 6.0vw, 36px)' }}
        >
          {typeof value === 'number' && value >= 10000 ? (
            <>
              {(value / 10000).toFixed(1)}
              <span className="ml-1 font-normal" style={{ fontSize: 'clamp(12px, 2.8vw, 14px)', opacity: 0.85 }}>万</span>
            </>
          ) : (
            <>
              {value.toLocaleString()}
              {unit && (
                <span className="ml-1 font-normal" style={{ fontSize: 'clamp(12px, 2.8vw, 14px)', opacity: 0.85 }}>
                  {unit}
                </span>
              )}
            </>
          )}
        </div>
        {hasChange && (
          <div className="flex items-center justify-center whitespace-nowrap" style={{ fontSize: 'clamp(10px, 2.4vw, 14px)', color: 'rgba(255,255,255,0.95)' }}>
            {title === '在营门店数' ? (
              // 在营门店数显示为 ±xx家
              <span>{`${changeRate! >= 0 ? '+' : ''}${Math.abs(changeRate!)}家`}</span>
            ) : (
              <>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span>{formatChangeRate(changeRate)}</span>
              </>
            )}
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
              '家'
            )}
          </Grid.Item>
          <Grid.Item>
            {renderMetricCard(
              '当期总营业额',
              corePerformance.totalRevenue.value,
              corePerformance.totalRevenue.changeRate
            )}
          </Grid.Item>
          <Grid.Item>
            {renderMetricCard(
              '日店均营业额',
              corePerformance.avgStoreRevenue.value,
              corePerformance.avgStoreRevenue.changeRate,
              '元'
            )}
          </Grid.Item>
        </Grid>
      </div>
    </div>
  );
};

export default CorePerformanceSection;