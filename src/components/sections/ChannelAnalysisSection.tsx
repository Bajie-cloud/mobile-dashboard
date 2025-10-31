import React, { useRef, useEffect, useState } from 'react';
import { Card, Grid } from 'antd-mobile';
import * as echarts from 'echarts';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { formatCurrency, formatChangeRate, getChangeColorClass, isPositiveChange } from '../../utils/format';
import MetricDefinitionModal from '../common/MetricDefinitionModal';
import { getMetricDefinition, MetricDefinition } from '../../data/metricDefinitions';

interface ChannelAnalysisSectionProps {
  detailed?: boolean;
}

const ChannelAnalysisSection: React.FC<ChannelAnalysisSectionProps> = () => {
  const { channelAnalysis } = useDashboardStore();
  const chartRef = useRef<HTMLDivElement>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | undefined>();

  const handleMetricHelp = (metricId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const metric = getMetricDefinition(metricId);
    setSelectedMetric(metric);
    setModalVisible(true);
  };

  useEffect(() => {
    if (!channelAnalysis || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}% ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center',
        textStyle: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '堂食外卖比',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { 
              value: channelAnalysis.dineInRatio, 
              name: '堂食',
              itemStyle: { color: '#3b82f6' }
            },
            { 
              value: channelAnalysis.takeoutRatio, 
              name: '外卖',
              itemStyle: { color: '#10b981' }
            }
          ]
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
  }, [channelAnalysis]);

  if (!channelAnalysis) {
    return (
      <Card className="mx-3 mb-3">
        <div className="p-3">
          <h2 className="text-base font-semibold mb-3 text-gray-900">渠道分析</h2>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }



  return (
    <div className="space-y-3">
      {/* 堂食外卖比饼图卡片 */}
      <Card className="mx-3">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-gray-900">渠道分析</h2>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-blue-600">堂食外卖比</span>
              <HelpCircle 
                className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                onClick={(e) => handleMetricHelp('channel_ratio', e)}
              />
            </div>
          </div>
          
          {/* 饼图区域 */}
          <div className="mb-3">
            <div ref={chartRef} style={{ width: '100%', height: '180px' }}></div>
          </div>
          
          {/* 渠道数据对比 */}
          <div className="border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500 mb-2 text-center">渠道数据对比</div>
            <Grid columns={2} gap={8}>
              <Grid.Item>
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-center">
                    <div className="text-xs text-blue-600 mb-1">堂食</div>
                    <div className="text-sm font-bold text-blue-700 mb-1">
                      {channelAnalysis.dineInRatio.toFixed(1)}%
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">
                        客流: {channelAnalysis.dineInTraffic.toLocaleString()}人次
                      </div>
                      <div className="text-xs text-gray-600">
                        客单价: {formatCurrency(channelAnalysis.dineInAvgPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid.Item>
              <Grid.Item>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-center">
                    <div className="text-xs text-green-600 mb-1">外卖</div>
                    <div className="text-sm font-bold text-green-700 mb-1">
                      {channelAnalysis.takeoutRatio.toFixed(1)}%
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">
                        订单: {channelAnalysis.takeoutOrders.toLocaleString()}单
                      </div>
                      <div className="text-xs text-gray-600">
                        客单价: {formatCurrency(channelAnalysis.takeoutAvgPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid.Item>
            </Grid>
          </div>
        </div>
      </Card>

      {/* 详细数据卡片 */}
      <Card className="mx-3">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">渠道表现</h3>
            <span className="text-xs text-gray-500">较昨日</span>
          </div>
          
          <Grid columns={2} gap={8}>
            <Grid.Item>
              <div className="border-l-2 border-blue-500 pl-2">
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                  <span>当日堂食客流</span>
                  <HelpCircle 
                    className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                    onClick={(e) => handleMetricHelp('dine_in_traffic', e)}
                  />
                </div>
                <div className="text-sm font-bold text-gray-900 mb-1">
                  {channelAnalysis.dineInTraffic.toLocaleString()}
                  <span className="text-xs text-gray-500 ml-1">人次</span>
                </div>
                <div className={`flex items-center text-xs ${getChangeColorClass(channelAnalysis.dineInTrafficChangeRate)}`}>
                  {isPositiveChange(channelAnalysis.dineInTrafficChangeRate) ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  <span>{formatChangeRate(channelAnalysis.dineInTrafficChangeRate)}</span>
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="border-l-2 border-green-500 pl-2">
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                  <span>当日外卖订单数</span>
                  <HelpCircle 
                    className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                    onClick={(e) => handleMetricHelp('takeout_orders', e)}
                  />
                </div>
                <div className="text-sm font-bold text-gray-900 mb-1">
                  {channelAnalysis.takeoutOrders.toLocaleString()}
                  <span className="text-xs text-gray-500 ml-1">单</span>
                </div>
                <div className={`flex items-center text-xs ${getChangeColorClass(channelAnalysis.takeoutOrdersChangeRate)}`}>
                  {isPositiveChange(channelAnalysis.takeoutOrdersChangeRate) ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  <span>{formatChangeRate(channelAnalysis.takeoutOrdersChangeRate)}</span>
                </div>
              </div>
            </Grid.Item>
          </Grid>
          
          <div className="border-t border-gray-100 mt-3 pt-3">
            <Grid columns={2} gap={8}>
              <Grid.Item>
                <div className="border-l-2 border-blue-500 pl-2">
                  <div className="text-xs text-gray-500 mb-1 flex items-center">
                    <span>当日堂食客单价</span>
                    <HelpCircle 
                      className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                      onClick={(e) => handleMetricHelp('dine_in_avg_price', e)}
                    />
                  </div>
                  <div className="text-sm font-bold text-gray-900 mb-1">
                    {formatCurrency(channelAnalysis.dineInAvgPrice)}
                  </div>
                  <div className="text-xs text-gray-500">
                    变化: {channelAnalysis.dineInAvgPriceChange > 0 ? '+' : ''}{formatCurrency(channelAnalysis.dineInAvgPriceChange)}
                  </div>
                </div>
              </Grid.Item>
              <Grid.Item>
                <div className="border-l-2 border-green-500 pl-2">
                  <div className="text-xs text-gray-500 mb-1 flex items-center">
                    <span>当日外卖客单价</span>
                    <HelpCircle 
                      className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                      onClick={(e) => handleMetricHelp('takeout_avg_price', e)}
                    />
                  </div>
                  <div className="text-sm font-bold text-gray-900 mb-1">
                    {formatCurrency(channelAnalysis.takeoutAvgPrice)}
                  </div>
                  <div className="text-xs text-gray-500">
                    变化: {channelAnalysis.takeoutAvgPriceChange > 0 ? '+' : ''}{formatCurrency(channelAnalysis.takeoutAvgPriceChange)}
                  </div>
                </div>
              </Grid.Item>
            </Grid>
          </div>
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

export default ChannelAnalysisSection;