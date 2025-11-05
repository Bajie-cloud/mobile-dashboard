import React, { useRef, useEffect, useState } from 'react';
import { Card, Grid } from 'antd-mobile';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleMetricHelp = (metricId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const metric = getMetricDefinition(metricId);
    setSelectedMetric(metric);
    setModalVisible(true);
  };

  const handleRegionClick = (regionName: string) => {
    navigate(`/region-analysis/${encodeURIComponent(regionName)}`);
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
          const v = data.value;
          const display = v >= 10000 ? `${(v / 10000).toFixed(1)}万` : v.toFixed(1);
          return `${data.name}<br/>营业额: ${display}`;
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
          rotate: 0,
          color: '#000000'  // 设置X轴标签颜色为黑色
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function(value: number) {
            return value >= 10000 ? (value / 10000).toFixed(1) + '万' : value.toFixed(1);
          },
          fontSize: 10
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false  // 去掉横线（网格线）
        }
      },
      series: [
        {
          name: '营业额',
          type: 'bar',
          data: regionAnalysis.regions.map(r => ({
            value: r.revenue,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#F59E0B' },
                { offset: 1, color: '#F97316' }
              ])  // 使用黄色渐变，参考核心业绩概览板块的背景色
            }
          })),
          barWidth: '50%',
          itemStyle: {
            borderRadius: [2, 2, 0, 0]
          },
          label: {
            show: true,
            position: 'top',
            distance: 5,
            formatter: function(params: any) {
              const value = params.value;
              return value >= 10000 ? (value / 10000).toFixed(1) + '万' : value.toFixed(1);
            },
            fontSize: 10,
            color: '#374151',
            fontWeight: 'bold'
          }
        }
      ]
    };

    chart.setOption(option);

    // 添加点击事件
    chart.on('click', function(params: any) {
      if (params.componentType === 'series') {
        const regionName = params.name;
        handleRegionClick(regionName);
      }
    });

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
      <div className="mb-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="py-3">
            <div className="flex items-center justify-between mb-3 px-3">
              <div className="flex items-center">
                <h2 className="text-base font-semibold text-gray-900">区域分析</h2>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-yellow-600">营业额分布</span>
                <HelpCircle 
                  className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                  onClick={(e) => handleMetricHelp('region_revenue_distribution', e)}
                />
              </div>
            </div>
            
            {/* 图表区域 - 使用全宽布局 */}
            <div className="-mx-3">
              <div className="px-3">
                <div ref={chartRef} style={{ width: '100%', height: '180px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 区域详情网格 */}
      <div className="mb-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="py-3">
            <div className="flex items-center justify-between mb-3 px-3">
              <h3 className="text-sm font-medium text-gray-900">区域详情</h3>
              <span className="text-xs text-gray-500">按营业额排序</span>
            </div>
          
            <div className="-mx-3">
              <div className="px-3">
                <div className="space-y-2">
                  {regionAnalysis.regions.map((region, index) => (
                    <div 
                      key={region.name} 
                      className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                      onClick={() => handleRegionClick(region.name)}
                    >
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
                          className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
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
                          className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
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
                          className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                          onClick={(e) => handleMetricHelp('region_avg_store_revenue', e)}
                        />
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {region.avgStoreRevenue >= 10000 ? `${formatCurrency(region.avgStoreRevenue)}元` : `${region.avgStoreRevenue.toFixed(1)}元`}
                      </div>
                    </div>
                  </Grid.Item>
                    </Grid>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 区域概览统计 */}
      <div className="mb-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="py-3">
            <div className="flex items-center justify-between mb-3 px-3">
              <h3 className="text-sm font-medium text-gray-900">区域概览</h3>
              <span className="text-xs text-gray-500">今日汇总</span>
            </div>
            
            <div className="-mx-3">
              <div className="px-3">
                <Grid columns={2} gap={4}>
            <Grid.Item>
              <div className="text-center px-1 py-8 bg-[#EF5350] rounded-2xl min-w-0 mx-8">
                <div className="font-bold text-white whitespace-nowrap" style={{ fontSize: 'clamp(12px, 3.6vw, 16px)' }}>
                  {regionAnalysis.regions.length}
                </div>
                <div className="text-white mt-0 flex items-center justify-center whitespace-nowrap" style={{ fontSize: 'clamp(10px, 2.4vw, 12px)' }}>
                  <span>覆盖区域</span>
                  <HelpCircle 
                    className="w-2.5 h-2.5 ml-1 text-yellow-200 cursor-pointer hover:text-yellow-300" 
                    onClick={(e) => handleMetricHelp('region_coverage', e)}
                  />
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="text-center px-1 py-8 bg-[#FFA726] rounded-2xl min-w-0 mx-8">
                <div className="font-bold text-white whitespace-nowrap" style={{ fontSize: 'clamp(12px, 3.6vw, 16px)' }}>
                  {formatCurrency(regionAnalysis.regions.reduce((sum, region) => sum + region.revenue, 0))}
                </div>
                <div className="text-white mt-0 flex items-center justify-center whitespace-nowrap" style={{ fontSize: 'clamp(10px, 2.4vw, 12px)' }}>
                  <span>总营业额</span>
                  <HelpCircle 
                    className="w-2.5 h-2.5 ml-1 text-yellow-200 cursor-pointer hover:text-yellow-300" 
                    onClick={(e) => handleMetricHelp('region_total_revenue', e)}
                  />
                </div>
              </div>
                </Grid.Item>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </div>

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