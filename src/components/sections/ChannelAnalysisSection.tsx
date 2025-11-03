import React, { useRef, useEffect, useState } from 'react';
import { Card } from 'antd-mobile';
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
    
    // 检测屏幕尺寸，判断是否为移动端
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 375;
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}% <br/>金额: ¥{d}'
      },
      legend: {
        show: false
      },
      series: [
        // 完整环形图 - 堂食和外卖组成一个连续的环形
        {
          name: '堂食外卖比',
          type: 'pie',
          radius: isMobile ? ['35%', '70%'] : ['40%', '80%'], // 增大半径以充分利用卡片空间
          center: ['50%', '50%'], // 居中位置
          startAngle: 90, // 从顶部开始（12点钟方向）
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: function(params: any) {
              if (params.name === '堂食') {
                const revenue = channelAnalysis.dineInTraffic * channelAnalysis.dineInAvgPrice;
                // 移动端简化显示
                if (isMobile) {
                  return `{title|${params.name}}\n{percent|${params.percent}%}`;
                }
                return `{title|${params.name}}\n{percent|${params.percent}%}\n{amount|¥${(revenue/10000).toFixed(1)}万}`;
              } else {
                const revenue = channelAnalysis.takeoutOrders * channelAnalysis.takeoutAvgPrice;
                // 移动端简化显示
                if (isMobile) {
                  return `{title|${params.name}}\n{percent|${params.percent}%}`;
                }
                return `{title|${params.name}}\n{percent|${params.percent}%}\n{amount|¥${(revenue/10000).toFixed(1)}万}`;
              }
            },
            rich: {
              title: {
                fontSize: isMobile ? (isSmallMobile ? 9 : 10) : 11,
                fontWeight: 'bold',
                lineHeight: isMobile ? (isSmallMobile ? 11 : 12) : 14
              },
              percent: {
                fontSize: isMobile ? (isSmallMobile ? 11 : 12) : 13,
                fontWeight: 'bold',
                color: '#333',
                lineHeight: isMobile ? (isSmallMobile ? 13 : 14) : 16
              },
              amount: {
                fontSize: isMobile ? (isSmallMobile ? 8 : 9) : 9,
                color: '#666',
                lineHeight: isMobile ? (isSmallMobile ? 10 : 11) : 12
              }
            },
            position: function(params: any) {
              if (isMobile) {
                // 移动端使用更保守的位置，避免超出屏幕
                if (params.name === '堂食') {
                  // 堂食标注：往上往里移动 - 减少Y值(往上)，减少X值(往里)
                  return isSmallMobile ? ['110%', '110%'] : ['120%', '115%'];
                } else {
                  // 外卖标注：往下往里移动 - 增加Y值(往下)，增加X值(往里)
                  return isSmallMobile ? ['-15%', '-10%'] : ['-25%', '-20%'];
                }
              } else {
                // 桌面端保持原有位置但微调
                if (params.name === '堂食') {
                  // 堂食标注：往上往里移动 - 减少Y值(往上)，减少X值(往里)
                  return ['165%', '145%'];
                } else {
                  // 外卖标注：往下往里移动 - 增加Y值(往下)，增加X值(往里)
                  return ['-65%', '-45%'];
                }
              }
            },
            color: function(params: any) {
              // 根据数据项设置标注颜色 - 堂食蓝色，外卖橙黄色
              return params.name === '堂食' ? '#2196F3' : '#FF9800';
            }
          },
          labelLine: {
            show: true,
            length: isMobile ? (isSmallMobile ? 10 : 15) : 25, // 增加标注线长度以适应新位置
            length2: isMobile ? (isSmallMobile ? 8 : 10) : 18, // 增加第二段长度
            lineStyle: {
              width: isMobile ? 1.5 : 2,
              type: 'solid',
              curveness: 0.2 // 减少弯曲度，使线条更直接
            }
          },
          emphasis: {
            scale: false,
            scaleSize: 5
          },
          data: [
            { 
              value: channelAnalysis.takeoutRatio, 
              name: '外卖',
              itemStyle: { 
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#FFB74D' }, // 浅橙色
                    { offset: 1, color: '#FF9800' }  // 深橙色
                  ]
                }
              },
              labelLine: {
                lineStyle: {
                  color: '#FF9800' // 外卖标注线为橙色
                }
              }
            },
            { 
              value: channelAnalysis.dineInRatio, 
              name: '堂食',
              itemStyle: { 
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#64B5F6' }, // 浅蓝色
                    { offset: 1, color: '#2196F3' }  // 深蓝色
                  ]
                }
              },
              labelLine: {
                lineStyle: {
                  color: '#2196F3' // 堂食标注线为蓝色
                }
              }
            }
          ]
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => {
      // 重新检测屏幕尺寸并更新图表配置
      const newIsMobile = window.innerWidth <= 768;
      const newIsSmallMobile = window.innerWidth <= 375;
      
      // 如果屏幕尺寸类别发生变化，重新设置配置
      if (newIsMobile !== isMobile || newIsSmallMobile !== isSmallMobile) {
        const newOption = {
          ...option,
          series: [{
            ...option.series[0],
            radius: newIsMobile ? ['35%', '70%'] : ['40%', '80%'],
            label: {
              ...option.series[0].label,
              rich: {
                title: {
                  fontSize: newIsMobile ? (newIsSmallMobile ? 9 : 10) : 11,
                  fontWeight: 'bold',
                  lineHeight: newIsMobile ? (newIsSmallMobile ? 11 : 12) : 14
                },
                percent: {
                  fontSize: newIsMobile ? (newIsSmallMobile ? 11 : 12) : 13,
                  fontWeight: 'bold',
                  color: '#333',
                  lineHeight: newIsMobile ? (newIsSmallMobile ? 13 : 14) : 16
                },
                amount: {
                  fontSize: newIsMobile ? (newIsSmallMobile ? 8 : 9) : 9,
                  color: '#666',
                  lineHeight: newIsMobile ? (newIsSmallMobile ? 10 : 11) : 12
                }
              },
              position: function(params: any) {
                if (newIsMobile) {
                  if (params.name === '堂食') {
                    // 堂食标注：往上往里移动 - 减少Y值(往上)，减少X值(往里)
                    return newIsSmallMobile ? ['110%', '110%'] : ['120%', '115%'];
                  } else {
                    // 外卖标注：往下往里移动 - 增加Y值(往下)，增加X值(往里)
                    return newIsSmallMobile ? ['-15%', '-10%'] : ['-25%', '-20%'];
                  }
                } else {
                  if (params.name === '堂食') {
                    // 堂食标注：往上往里移动 - 减少Y值(往上)，减少X值(往里)
                    return ['165%', '145%'];
                  } else {
                    // 外卖标注：往下往里移动 - 增加Y值(往下)，增加X值(往里)
                    return ['-65%', '-45%'];
                  }
                }
              }
            },
            labelLine: {
              ...option.series[0].labelLine,
              length: newIsMobile ? (newIsSmallMobile ? 10 : 15) : 25, // 增加标注线长度以适应新位置
              length2: newIsMobile ? (newIsSmallMobile ? 8 : 10) : 18, // 增加第二段长度
              lineStyle: {
                ...option.series[0].labelLine.lineStyle,
                width: newIsMobile ? 1.5 : 2,
                curveness: 0.2 // 减少弯曲度，使线条更直接
              }
            }
          }]
        };
        chart.setOption(newOption, true);
      }
      
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
    <div className="mb-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="py-3">
          <div className="flex items-center justify-between mb-3 px-3">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-gray-900">渠道分析</h2>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-yellow-600">堂食外卖比</span>
              <HelpCircle 
                className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                onClick={(e) => handleMetricHelp('channel_ratio', e)}
              />
            </div>
          </div>
          
          {/* 主要内容区域：左侧环形图区域，右侧渠道表现卡片 */}
          <div className="flex -mx-3">
            {/* 左侧：环形图区域 - 扩大占比，给图表更多空间 */}
            <div className="flex-[5] px-3">
              <div className="bg-gradient-to-br from-gray-50 to-white overflow-hidden h-full flex items-center justify-center">
                {/* 环形图 - 居中显示 */}
                <div 
                  ref={chartRef} 
                  style={{ 
                    width: '100%', 
                    height: window.innerWidth <= 375 ? '180px' : window.innerWidth <= 768 ? '200px' : '220px' 
                  }}
                ></div>
              </div>
            </div>
            
            {/* 右侧：渠道表现卡片 - 减少占比，紧挨右侧边框 */}
            <div className="flex-[2] px-3">
              <div className="bg-gray-50 p-2 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-900">渠道表现</h3>
                  <span className="text-[10px] text-gray-500">较昨日</span>
                </div>
                
                <div className="space-y-2 flex-1">
                  {/* 堂食客流 */}
                  <div className="border-l-2 border-orange-500 pl-1.5">
                    <div className="text-[10px] text-gray-500 mb-0.5 flex items-center">
                      <span>当日堂食客流</span>
                      <HelpCircle 
                        className="w-2.5 h-2.5 ml-0.5 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                        onClick={(e) => handleMetricHelp('dine_in_traffic', e)}
                      />
                    </div>
                    <div className="text-xs font-bold text-gray-900 mb-0.5">
                      {channelAnalysis.dineInTraffic.toLocaleString()}
                      <span className="text-[10px] text-gray-500 ml-0.5">人次</span>
                    </div>
                    <div className={`flex items-center text-[10px] ${getChangeColorClass(channelAnalysis.dineInTrafficChangeRate)}`}>
                      {isPositiveChange(channelAnalysis.dineInTrafficChangeRate) ? (
                        <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      <span>{formatChangeRate(channelAnalysis.dineInTrafficChangeRate)}</span>
                    </div>
                  </div>
                  
                  {/* 外卖订单数 */}
                  <div className="border-l-2 border-blue-500 pl-1.5">
                    <div className="text-[10px] text-gray-500 mb-0.5 flex items-center">
                      <span>当日外卖订单数</span>
                      <HelpCircle 
                        className="w-2.5 h-2.5 ml-0.5 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                        onClick={(e) => handleMetricHelp('takeout_orders', e)}
                      />
                    </div>
                    <div className="text-xs font-bold text-gray-900 mb-0.5">
                      {channelAnalysis.takeoutOrders.toLocaleString()}
                      <span className="text-[10px] text-gray-500 ml-0.5">单</span>
                    </div>
                    <div className={`flex items-center text-[10px] ${getChangeColorClass(channelAnalysis.takeoutOrdersChangeRate)}`}>
                      {isPositiveChange(channelAnalysis.takeoutOrdersChangeRate) ? (
                        <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      <span>{formatChangeRate(channelAnalysis.takeoutOrdersChangeRate)}</span>
                    </div>
                  </div>
                  
                  {/* 堂食客单价 */}
                  <div className="border-l-2 border-orange-500 pl-1.5">
                    <div className="text-[10px] text-gray-500 mb-0.5 flex items-center">
                      <span>当日堂食客单价</span>
                      <HelpCircle 
                        className="w-2.5 h-2.5 ml-0.5 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                        onClick={(e) => handleMetricHelp('dine_in_avg_price', e)}
                      />
                    </div>
                    <div className="text-xs font-bold text-gray-900 mb-0.5">
                      {formatCurrency(channelAnalysis.dineInAvgPrice)}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      变化: {channelAnalysis.dineInAvgPriceChange > 0 ? '+' : ''}{formatCurrency(channelAnalysis.dineInAvgPriceChange)}
                    </div>
                  </div>
                  
                  {/* 外卖客单价 */}
                  <div className="border-l-2 border-blue-500 pl-1.5">
                    <div className="text-[10px] text-gray-500 mb-0.5 flex items-center">
                      <span>当日外卖客单价</span>
                      <HelpCircle 
                        className="w-2.5 h-2.5 ml-0.5 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                        onClick={(e) => handleMetricHelp('takeout_avg_price', e)}
                      />
                    </div>
                    <div className="text-xs font-bold text-gray-900 mb-0.5">
                      {formatCurrency(channelAnalysis.takeoutAvgPrice)}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      变化: {channelAnalysis.takeoutAvgPriceChange > 0 ? '+' : ''}{formatCurrency(channelAnalysis.takeoutAvgPriceChange)}
                    </div>
                  </div>
                </div>
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

export default ChannelAnalysisSection;