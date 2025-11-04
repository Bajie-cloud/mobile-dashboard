import React, { useState, useEffect } from 'react';
import { NavBar, Grid } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import channelAnalysisData from '../data/channelAnalysis.json';
import takeoutPlatformsData from '../data/takeoutPlatforms.json';
import { formatChangeRate, isPositiveChange } from '../utils/format';

interface PlatformData {
  name: string;
  turnover: number;
  orders: number;
  avgPrice: number;
  turnoverChange: number;
  ordersChange: number;
  avgPriceChange: number; // rate (%) from data source
  avgPriceChangeValue?: number; // computed value change in 元
  marketShare: number;
}

const ChannelAnalysisDetail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'dinein'; // 默认堂食
  const [channelData, setChannelData] = useState<any>(null);
  const [platformData, setPlatformData] = useState<Record<string, PlatformData>>({});
  
  const isTakeout = type === 'takeout';
  const title = isTakeout ? '外卖渠道分析' : '堂食渠道分析';

  useEffect(() => {
    // 从JSON数据中获取最新的渠道分析数据
    const latestData = channelAnalysisData[0];
    setChannelData(latestData);

    // 如果是外卖渠道，加载平台数据
    if (isTakeout) {
      const latestPlatformData = takeoutPlatformsData[0];
      const formattedData: Record<string, PlatformData> = {};
      
      latestPlatformData.platforms.forEach(platform => {
        const key = platform.platform_name === '美团' ? 'meituan' : 
                    platform.platform_name === '饿了么' ? 'eleme' : 'jingdong';
        
        const avgPriceChangeRate = platform.avg_price_change_rate; // %
        const avgPriceChangeValue = Number(((platform.avg_price * avgPriceChangeRate) / 100).toFixed(1));
        
        formattedData[key] = {
          name: platform.platform_name,
          turnover: platform.turnover,
          orders: platform.orders,
          avgPrice: platform.avg_price,
          turnoverChange: platform.turnover_change_rate,
          ordersChange: platform.orders_change_rate,
          avgPriceChange: avgPriceChangeRate,
          avgPriceChangeValue,
          marketShare: platform.market_share
        };
      });
      
      setPlatformData(formattedData);
    }
  }, [isTakeout]);

  // 渲染单个指标卡片（参考核心业绩概览样式）
  const renderMetricCard = (title: string, value: number, unit: string, change: number, changeType: 'rate' | 'value') => {
    const isPositive = change > 0;
    const displayValue = changeType === 'rate'
      ? `${Math.abs(change).toFixed(1)}%`
      : `${change > 0 ? '+' : change < 0 ? '-' : ''}${Math.abs(change).toFixed(1)}${unit || '元'}`;
    console.log('[ChannelAnalysisDetail/renderMetricCard]', { title, change, changeType, displayValue });
    
    return (
      <div className="rounded-2xl shadow-md p-3 text-center" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>
        <div className="text-white text-center whitespace-nowrap text-sm mb-1 opacity-95">
          {title}
        </div>
        <div className="font-bold text-white whitespace-nowrap mb-1" style={{ fontSize: 'clamp(16px, 4.5vw, 24px)' }}>
          {value.toString()}
          <span className="text-xs text-white ml-1 opacity-85">{unit}</span>
        </div>
        <div className={`flex items-center justify-center text-xs ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {displayValue}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar 
        onBack={() => navigate(-1)}
        className="bg-white shadow-sm"
      >
        {title}
      </NavBar>

      <div className="p-4">
        {/* 外卖平台数据概览（简化版，只显示数据概览） */}
        {isTakeout && Object.keys(platformData).length > 0 && (
          <div className="space-y-4">
            {/* 美团外卖平台卡片 */}
            {platformData.meituan && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">美团外卖</h3>
                <Grid columns={3} gap={8}>
                  <Grid.Item>
                    {renderMetricCard(
                      '营业额',
                      platformData.meituan.turnover,
                      '元',
                      platformData.meituan.turnoverChange,
                      'rate'
                    )}
                  </Grid.Item>
                  <Grid.Item>
                    {renderMetricCard(
                      '订单数',
                      platformData.meituan.orders,
                      '单',
                      platformData.meituan.ordersChange,
                      'rate'
                    )}
                  </Grid.Item>
                  <Grid.Item>
                    {renderMetricCard(
                      '客单价',
                      platformData.meituan.avgPrice,
                      '元',
                      platformData.meituan.avgPriceChangeValue ?? platformData.meituan.avgPriceChange,
                      'value'
                    )}
                  </Grid.Item>
                </Grid>
              </div>
            )}

            {/* 饿了么外卖平台卡片 */}
            {platformData.eleme && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">饿了么</h3>
                <Grid columns={3} gap={8}>
                  <Grid.Item>
                    {renderMetricCard(
                      '营业额',
                      platformData.eleme.turnover,
                      '元',
                      platformData.eleme.turnoverChange,
                      'rate'
                    )}
                  </Grid.Item>
                  <Grid.Item>
                    {renderMetricCard(
                      '订单数',
                      platformData.eleme.orders,
                      '单',
                      platformData.eleme.ordersChange,
                      'rate'
                    )}
                  </Grid.Item>
                  <Grid.Item>
                    {renderMetricCard(
                      '客单价',
                      platformData.eleme.avgPrice,
                      '元',
                      platformData.eleme.avgPriceChangeValue ?? platformData.eleme.avgPriceChange,
                      'value'
                    )}
                  </Grid.Item>
                </Grid>
              </div>
            )}

            {/* 京东外卖平台卡片 */}
            {platformData.jingdong && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">京东外卖</h3>
                <Grid columns={3} gap={8}>
                  <Grid.Item>
                    {renderMetricCard(
                      '营业额',
                      platformData.jingdong.turnover,
                      '元',
                      platformData.jingdong.turnoverChange,
                      'rate'
                    )}
                  </Grid.Item>
                  <Grid.Item>
                    {renderMetricCard(
                      '订单数',
                      platformData.jingdong.orders,
                      '单',
                      platformData.jingdong.ordersChange,
                      'rate'
                    )}
                  </Grid.Item>
                  <Grid.Item>
                    {renderMetricCard(
                      '客单价',
                      platformData.jingdong.avgPrice,
                      '元',
                      platformData.jingdong.avgPriceChangeValue ?? platformData.jingdong.avgPriceChange,
                      'value'
                    )}
                  </Grid.Item>
                </Grid>
              </div>
            )}
          </div>
        )}

        {/* 堂食渠道的核心指标卡片 */}
        {channelData && !isTakeout && (
          <div className="mb-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">堂食数据</h3>
                <Grid columns={2} gap={8}>
                  <Grid.Item>
                    {renderMetricCard(
                      '当期堂食客流',
                      channelData.dineInTraffic,
                      '人次',
                      channelData.dineInTrafficChangeRate,
                      'rate'
                    )}
                  </Grid.Item>
                  <Grid.Item>
                    {renderMetricCard(
                      '当期堂食客单价',
                      channelData.dineInAvgPrice,
                      '元',
                      Number(((channelData.dineInAvgPrice * channelData.dineInAvgPriceChange) / 100).toFixed(1)),
                      'value'
                    )}
                  </Grid.Item>
                </Grid>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelAnalysisDetail;