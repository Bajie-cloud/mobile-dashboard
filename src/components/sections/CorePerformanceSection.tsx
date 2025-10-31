import React, { useState } from 'react';
import { Card, Grid } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { formatCurrency, formatChangeRate, getChangeColorClass, isPositiveChange } from '../../utils/format';
import MetricDefinitionTooltip from '../common/MetricDefinitionModal';
import { getMetricDefinition, MetricDefinition } from '../../data/metricDefinitions';

const CorePerformanceSection: React.FC = () => {
  const navigate = useNavigate();
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
      <Card className="mx-3 mb-3">
        <div className="p-3">
          <h2 className="text-base font-semibold mb-3 text-gray-900">核心业绩概览</h2>
          <div className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const renderMetricItem = (title: string, value: number, changeRate?: number, unit?: string, metricId?: string) => {
    const hasChange = changeRate !== undefined;
    const isPositive = hasChange ? isPositiveChange(changeRate) : false;
    const changeColorClass = hasChange ? getChangeColorClass(changeRate) : '';

    return (
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
          <span>{title}</span>
          {metricId && (
            <HelpCircle 
              className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
              onClick={(e) => handleMetricHelp(metricId, e)}
            />
          )}
        </div>
        <div className="text-lg font-bold text-gray-900 mb-1">
          {typeof value === 'number' && value >= 10000 ? formatCurrency(value) : value.toLocaleString()}
          {unit && <span className="text-xs text-gray-500 ml-1 font-normal">{unit}</span>}
        </div>
        {hasChange && (
          <div className={`flex items-center justify-center text-xs ${changeColorClass}`}>
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
      <Card 
        className="mx-3 cursor-pointer"
        onClick={() => navigate('/core-performance')}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">核心业绩概览</h2>
            <span className="text-xs text-blue-600">日环比</span>
          </div>
          
          {/* 三个核心指标 */}
          <Grid columns={1} gap={12}>
            <Grid.Item>
              {renderMetricItem(
                '在营门店数',
                corePerformance.activeStores.value,
                corePerformance.activeStores.changeRate,
                '家',
                'active_stores'
              )}
            </Grid.Item>
          </Grid>
          
          <div className="border-t border-gray-100 mt-3 pt-3">
            <Grid columns={2} gap={8}>
              <Grid.Item>
                {renderMetricItem(
                  '当日总营业额',
                  corePerformance.totalRevenue.value,
                  corePerformance.totalRevenue.changeRate,
                  undefined,
                  'total_revenue'
                )}
              </Grid.Item>
              <Grid.Item>
                {renderMetricItem(
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
      </Card>

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