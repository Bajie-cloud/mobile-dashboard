import React, { useRef, useEffect, useState } from 'react';
import { Card, Grid } from 'antd-mobile';
import * as echarts from 'echarts';
import { useDashboardStore } from '../../store/dashboardStore';
import { formatCurrency, formatChangeRate, getChangeColorClass, isPositiveChange } from '../../utils/format';
import { TrendingUp, TrendingDown, MapPin, HelpCircle } from 'lucide-react';
import MetricDefinitionModal from '../common/MetricDefinitionModal';
import { MetricDefinition, getMetricDefinition } from '../../data/metricDefinitions';

const RegionAnalysisSection: React.FC = () => {
  const { regionAnalysis } = useDashboardStore();
  const chartRef = useRef<HTMLDivElement>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | undefined>(undefined);

  const handleMetricHelp = (metricId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const metric = getMetricDefinition(metricId);
    setSelectedMetric(metric);
    setModalVisible(true);
  };

  useEffect(() => {
    if (!regionAnalysis || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const data = params[0];
          return `${data.name}<br/>营业额: ${formatCurrency(data.value)}`;
        }
      },
      grid: {
        left: '8%',
        right: '8%',
        top: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: regionAnalysis.regions.map(r => r.name),
        axisLabel: {
          fontSize: 10,
          rotate: 0
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function(value: number) {
            return value >= 10000 ? (value / 10000).toFixed(0) + '万' : value.toString();
          },
          fontSize: 10
        }
      },
      series: [
        {
          name: '营业额',
          type: 'bar',
          data: regionAnalysis.regions.map(r => ({
            value: r.revenue,
            itemStyle: {
              color: r.revenueChangeRate >= 0 ? '#10b981' : '#ef4444'
            }
          })),
          barWidth: '50%',
          itemStyle: {
            borderRadius: [2, 2, 0, 0]
          }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [regionAnalysis]);

  if (!regionAnalysis) {
    return (
      <Card className="mx-3 mb-3">
        <div className="p-3">
          <h2 className="text-base font-semibold mb-3 text-gray-900">区域分析</h2>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card className="mx-3">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-gray-900">区域分析</h2>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-blue-600">营业额分布</span>
              <HelpCircle 
                className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                onClick={(e) => handleMetricHelp('region_revenue_distribution', e)}
              />
            </div>
          </div>
          
          {/* 紧凑的图表 */}
          <div ref={chartRef} style={{ width: '100%', height: '180px' }}></div>
        </div>
      </Card>

      {/* 区域详情网格 */}
      <Card className="mx-3">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">区域详情</h3>
            <span className="text-xs text-gray-500">按营业额排序</span>
          </div>
          
          <div className="space-y-2">
            {regionAnalysis.regions.map((region, index) => (
              <div key={region.name} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{region.name}</span>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                  <div className={`flex items-center text-xs ${getChangeColorClass(region.revenueChangeRate)}`}>
                    {isPositiveChange(region.revenueChangeRate) ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    <span>{formatChangeRate(region.revenueChangeRate)}</span>
                  </div>
                </div>
                
                <Grid columns={3} gap={8}>
                  <Grid.Item>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                        <span>营业额</span>
                        <HelpCircle 
                          className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                          onClick={(e) => handleMetricHelp('region_revenue', e)}
                        />
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(region.revenue)}
                      </div>
                    </div>
                  </Grid.Item>
                  <Grid.Item>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                        <span>门店数</span>
                        <HelpCircle 
                          className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                          onClick={(e) => handleMetricHelp('region_store_count', e)}
                        />
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {region.storeCount}家
                      </div>
                    </div>
                  </Grid.Item>
                  <Grid.Item>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                        <span>店均营业额</span>
                        <HelpCircle 
                          className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                          onClick={(e) => handleMetricHelp('region_avg_store_revenue', e)}
                        />
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(region.avgStoreRevenue)}
                      </div>
                    </div>
                  </Grid.Item>
                </Grid>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 区域概览统计 */}
      <Card className="mx-3">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">区域概览</h3>
            <span className="text-xs text-gray-500">今日汇总</span>
          </div>
          
          <Grid columns={2} gap={8}>
            <Grid.Item>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-sm font-bold text-blue-700">
                  {regionAnalysis.regions.length}
                </div>
                <div className="text-xs text-gray-600 mt-1 flex items-center justify-center">
                  <span>覆盖区域</span>
                  <HelpCircle 
                    className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                    onClick={(e) => handleMetricHelp('region_coverage', e)}
                  />
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-sm font-bold text-green-700">
                  {formatCurrency(regionAnalysis.regions.reduce((sum, region) => sum + region.revenue, 0))}
                </div>
                <div className="text-xs text-gray-600 mt-1 flex items-center justify-center">
                  <span>总营业额</span>
                  <HelpCircle 
                    className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                    onClick={(e) => handleMetricHelp('region_total_revenue', e)}
                  />
                </div>
              </div>
            </Grid.Item>
          </Grid>
        </div>
      </Card>

      {/* 指标定义弹窗 */}
      <MetricDefinitionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        metric={selectedMetric}
      />
    </div>
  );
};

export default RegionAnalysisSection;