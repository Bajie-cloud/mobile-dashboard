import React, { useRef, useEffect } from 'react';
import { Card } from 'antd-mobile';
import * as echarts from 'echarts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { formatChangeRate, isPositiveChange } from '../../utils/format';

interface ChannelAnalysisSectionProps {
  detailed?: boolean;
}

const ChannelAnalysisSection: React.FC<ChannelAnalysisSectionProps> = () => {
  const { channelAnalysis } = useDashboardStore();
  const chartRef = useRef<HTMLDivElement>(null);

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
        // 实心饼图 - 堂食和外卖
        {
          name: '外卖营销结构',
          type: 'pie',
          radius: isMobile ? '60%' : '70%', // 改为实心饼图，只设置一个半径值
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
                // 移动端标注更紧凑，更贴近饼图
                if (params.name === '堂食') {
                  return isSmallMobile ? ['100%', '100%'] : ['102%', '102%'];
                } else {
                  return isSmallMobile ? ['100%', '100%'] : ['102%', '102%'];
                }
              } else {
                // 桌面端标注更紧凑，更贴近饼图
                if (params.name === '堂食') {
                  return ['102%', '102%'];
                } else {
                  return ['102%', '102%'];
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
            length: isMobile ? (isSmallMobile ? 2 : 4) : 5, // 进一步缩短标注线长度
            length2: isMobile ? (isSmallMobile ? 1 : 2) : 3, // 进一步缩短第二段长度
            lineStyle: {
              width: 1,
              type: 'solid'
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
                color: '#FFA726' // 橙黄色
              },
              labelLine: {
                lineStyle: {
                  color: '#FFA726' // 外卖标注线为橙黄色
                }
              }
            },
            { 
              value: channelAnalysis.dineInRatio, 
              name: '堂食',
              itemStyle: { 
                color: '#EF5350' // 红色
              },
              labelLine: {
                lineStyle: {
                  color: '#EF5350' // 堂食标注线为红色
                }
              }
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

  // 渲染指标卡片的函数
  const renderMetricCard = (
    title: string,
    value: string | number,
    unit: string,
    change: number | string,
    changeType: 'rate' | 'value',
    borderColor: string,
    isPositive?: boolean
  ) => (
    <div className={`bg-white rounded-lg border-l-4 ${borderColor} p-2 shadow-sm`}>
      <div className="text-xs text-gray-600 mb-1 leading-tight truncate">{title}</div>
      <div className="text-sm font-bold text-gray-900 mb-1 leading-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
        <span className="text-xs text-gray-500 ml-1">{unit}</span>
      </div>
      <div className={`flex items-center text-xs leading-tight ${
        isPositive !== undefined 
          ? (isPositive ? 'text-green-600' : 'text-red-600')
          : 'text-gray-600'
      }`}>
        {isPositive !== undefined && (
          isPositive ? (
            <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1 flex-shrink-0" />
          )
        )}
        <span className="truncate">
          {changeType === 'rate' 
            ? (typeof change === 'number' ? formatChangeRate(change) : change)
            : `变化 ${typeof change === 'number' && change > 0 ? '+' : ''}${change}`
          }
        </span>
      </div>
    </div>
  );

  return (
    <div className="mb-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="py-3">
          <div className="flex items-center justify-between mb-3 px-3">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-gray-900">渠道分析</h2>
            </div>
          </div>
          
          {/* 主要内容区域：左侧饼图区域，右侧2x2网格卡片 */}
          <div className="flex -mx-3">
            {/* 左侧：饼图区域 - 缩小占比 */}
            <div className="w-2/5 px-2">
              <div className="bg-gradient-to-br from-gray-50 to-white overflow-hidden h-full flex items-center justify-center">
                <div 
                  ref={chartRef} 
                  style={{ 
                    width: '100%', 
                    height: window.innerWidth <= 375 ? '160px' : window.innerWidth <= 768 ? '180px' : '200px' 
                  }}
                ></div>
              </div>
            </div>
            
            {/* 右侧：2x2网格卡片 - 扩大占比 */}
            <div className="w-3/5 px-2">
              <div className="grid grid-cols-1 gap-2 h-full">
                {/* 第一行：堂食客流 和 外卖订单数 */}
                <div className="grid grid-cols-2 gap-2">
                  {renderMetricCard(
                    '当日堂食客流',
                    channelAnalysis.dineInTraffic,
                    '人次',
                    channelAnalysis.dineInTrafficChangeRate,
                    'rate',
                    'border-blue-500',
                    isPositiveChange(channelAnalysis.dineInTrafficChangeRate)
                  )}
                  {renderMetricCard(
                    '当日外卖订单数',
                    channelAnalysis.takeoutOrders,
                    '单',
                    channelAnalysis.takeoutOrdersChangeRate,
                    'rate',
                    'border-green-500',
                    isPositiveChange(channelAnalysis.takeoutOrdersChangeRate)
                  )}
                </div>
                
                {/* 第二行：堂食客单价 和 外卖客单价 */}
                <div className="grid grid-cols-2 gap-2">
                  {renderMetricCard(
                    '当日堂食客单价',
                    channelAnalysis.dineInAvgPrice.toFixed(1),
                    '',
                    channelAnalysis.dineInAvgPriceChange.toFixed(1),
                    'value',
                    'border-blue-500',
                    channelAnalysis.dineInAvgPriceChange > 0
                  )}
                  {renderMetricCard(
                    '当日外卖客单价',
                    channelAnalysis.takeoutAvgPrice.toFixed(1),
                    '',
                    channelAnalysis.takeoutAvgPriceChange.toFixed(1),
                    'value',
                    'border-green-500',
                    channelAnalysis.takeoutAvgPriceChange > 0
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelAnalysisSection;