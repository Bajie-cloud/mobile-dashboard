import React, { useState } from 'react';
import { Card, Grid } from 'antd-mobile';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { formatCurrency, formatChangeRate, getChangeColorClass, isPositiveChange } from '../../utils/format';
import MetricDefinitionTooltip from '../common/MetricDefinitionModal';
import { getMetricDefinition, MetricDefinition } from '../../data/metricDefinitions';

const CorePerformanceSection: React.FC = () => {
  const { corePerformance } = useDashboardStore();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | undefined>();
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMetricHelp = (metricId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const metric = getMetricDefinition(metricId);
    setSelectedMetric(metric);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setTooltipVisible(true);
  };

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

  // 渲染主要指标（当日总营业额）
  const renderMainMetric = (title: string, value: number, changeRate?: number, metricId?: string) => {
    const hasChange = changeRate !== undefined;
    const isPositive = hasChange ? isPositiveChange(changeRate) : false;

    return (
      <div className="text-center mb-4">
        <div className="text-sm text-white text-opacity-90 mb-2 flex items-center justify-center">
          <span>{title}</span>
          {metricId && (
            <HelpCircle 
              className="w-4 h-4 ml-1 text-white text-opacity-80 cursor-pointer hover:text-opacity-100" 
              onClick={(e) => handleMetricHelp(metricId, e)}
            />
          )}
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {formatCurrency(value)}
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

  // 渲染次要指标（在营门店数和日店均营业额）
  const renderSecondaryMetric = (title: string, value: number, changeRate?: number, unit?: string, metricId?: string) => {
    const hasChange = changeRate !== undefined;
    const isPositive = hasChange ? isPositiveChange(changeRate) : false;

    return (
      <div className="text-center">
        <div className="text-xs text-white text-opacity-80 mb-1 flex items-center justify-center">
          <span>{title}</span>
          {metricId && (
            <HelpCircle 
              className="w-3 h-3 ml-1 text-white text-opacity-70 cursor-pointer hover:text-opacity-100" 
              onClick={(e) => handleMetricHelp(metricId, e)}
            />
          )}
        </div>
        <div className="text-xl font-bold text-white mb-1">
          {typeof value === 'number' && value >= 10000 ? formatCurrency(value) : value.toLocaleString()}
          {unit && <span className="text-sm text-white text-opacity-80 ml-1 font-normal">{unit}</span>}
        </div>
        {hasChange && (
          <div className="flex items-center justify-center text-xs text-white text-opacity-80">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            <span>{formatChangeRate(changeRate)}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* 核心业绩指标卡片 */}
      <div className="mb-3 -mx-3">
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-100 mx-3"
          style={{ 
            background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
            border: 'none'
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">核心业绩概览</h2>
              <span className="text-xs text-white text-opacity-80">日环比</span>
            </div>
            
            {/* 上方：当日总营业额 */}
            {renderMainMetric(
              '当日总营业额',
              corePerformance.totalRevenue.value,
              corePerformance.totalRevenue.changeRate,
              'total_revenue'
            )}
            
            {/* 下方：在营门店数和日店均营业额 */}
            <div className="border-t border-white border-opacity-20 pt-4">
              <Grid columns={2} gap={16}>
                <Grid.Item>
                  {renderSecondaryMetric(
                    '在营门店数',
                    corePerformance.activeStores.value,
                    corePerformance.activeStores.changeRate,
                    '家',
                    'active_stores'
                  )}
                </Grid.Item>
                <Grid.Item>
                  {renderSecondaryMetric(
                    '日店均营业额',
                    corePerformance.avgStoreRevenue.value,
                    corePerformance.avgStoreRevenue.changeRate,
                    undefined,
                    'avg_store_revenue'
                  )}
                </Grid.Item>
              </Grid>
            </div>
          </div>
        </div>
      </div>

      {/* 指标定义悬浮提示 */}
      <MetricDefinitionTooltip
        visible={tooltipVisible}
        onClose={() => setTooltipVisible(false)}
        metric={selectedMetric}
        position={tooltipPosition}
      />
    </div>
  );
};

export default CorePerformanceSection;