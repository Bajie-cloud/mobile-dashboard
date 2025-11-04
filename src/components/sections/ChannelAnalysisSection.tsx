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
        {
          name: '外卖营销结构',
          type: 'pie',
          radius: isMobile ? '60%' : '70%',
          center: ['50%', '50%'],
          startAngle: 90,
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false },
          labelLine: { show: false, length: 0, length2: 0, lineStyle: { width: 0 } },
          emphasis: { scale: false, scaleSize: 5 },
          data: [
            { value: channelAnalysis.takeoutRatio, name: '外卖', itemStyle: { color: '#FFA726' } },
            { value: channelAnalysis.dineInRatio, name: '堂食', itemStyle: { color: '#EF5350' } }
          ]
        }
      ],
      // 更新 graphic：同一行显示“名称 百分比”，并整体上移一行更贴近饼图
      graphic: [
        {
          type: 'group',
          left: 'center',
          top: (function() {
            const isMobile = window.innerWidth <= 768;
            const isSmallMobile = window.innerWidth <= 375;
            // 扩大两行间距且保持整体中心位置
            return isMobile ? (isSmallMobile ? '81%' : '82%') : '83%';
          })(),
          children: [
            // 堂食：红点 + 同一行文案“堂食 65.2%”
            {
              type: 'circle',
              shape: { r: 3 },
              style: { fill: '#EF5350' },
              left: -60,
              top: 0
            },
            {
              type: 'text',
              style: {
                text: `堂食 ${channelAnalysis.dineInRatio.toFixed(1)}%`,
                fill: '#000',
                fontSize: window.innerWidth <= 768 ? (window.innerWidth <= 375 ? 11 : 12) : 13,
                fontWeight: 'bold',
              },
              left: -50,
              top: -3
            },
          ]
        },
        {
          type: 'group',
          left: 'center',
          top: (function() {
            const isMobile = window.innerWidth <= 768;
            const isSmallMobile = window.innerWidth <= 375;
            // 增加两行间距，整体位置基本不变
            return isMobile ? (isSmallMobile ? '88%' : '89%') : '90%';
          })(),
          children: [
            // 外卖：橙点 + 同一行文案“外卖 34.8%”
            {
              type: 'circle',
              shape: { r: 3 },
              style: { fill: '#FFA726' },
              left: -60,
              top: 0
            },
            {
              type: 'text',
              style: {
                text: `外卖 ${channelAnalysis.takeoutRatio.toFixed(1)}%`,
                fill: '#000',
                fontSize: window.innerWidth <= 768 ? (window.innerWidth <= 375 ? 11 : 12) : 13,
                fontWeight: 'bold',
              },
              left: -50,
              top: -3
            },
          ]
        }
      ],
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
      <div className="text-xs text-black mb-1 leading-tight">{title}</div>
      <div className="text-sm font-bold text-black mb-1 leading-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
        <span className="text-xs text-black ml-1">{unit}</span>
      </div>
      <div className="flex items-center text-xs leading-tight text-black">
        {isPositive !== undefined && (
          isPositive ? (
            <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0 text-green-600" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1 flex-shrink-0 text-red-600" />
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
                    '当期堂食客流',
                    channelAnalysis.dineInTraffic,
                    '人次',
                    channelAnalysis.dineInTrafficChangeRate,
                    'rate',
                    'border-[#EF5350]',
                    isPositiveChange(channelAnalysis.dineInTrafficChangeRate)
                  )}
                  {renderMetricCard(
                    '当期外卖订单数',
                    channelAnalysis.takeoutOrders,
                    '单',
                    channelAnalysis.takeoutOrdersChangeRate,
                    'rate',
                    'border-[#FFA726]',
                    isPositiveChange(channelAnalysis.takeoutOrdersChangeRate)
                  )}
                </div>
                
                {/* 第二行：堂食客单价 和 外卖客单价 */}
                <div className="grid grid-cols-2 gap-2">
                  {renderMetricCard(
                    '当期堂食客单价',
                    channelAnalysis.dineInAvgPrice.toFixed(1),
                    '',
                    channelAnalysis.dineInAvgPriceChange.toFixed(1),
                    'value',
                    'border-[#EF5350]',
                    channelAnalysis.dineInAvgPriceChange > 0
                  )}
                  {renderMetricCard(
                    '当期外卖客单价',
                    channelAnalysis.takeoutAvgPrice.toFixed(1),
                    '',
                    channelAnalysis.takeoutAvgPriceChange.toFixed(1),
                    'value',
                    'border-[#FFA726]',
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