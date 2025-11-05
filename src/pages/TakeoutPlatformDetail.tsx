import React, { useState, useEffect } from 'react';
import { NavBar, Grid } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import takeoutPlatformsData from '../data/takeoutPlatforms.json';
import channelAnalysisData from '../data/channelAnalysis.json';

interface PlatformData {
  name: string;
  turnover: number;
  orders: number;
  avgPrice: number;
  turnoverChange: number;
  ordersChange: number;
  avgPriceChange: number;
  marketShare: number;
}

const TakeoutPlatformDetail: React.FC = () => {
  const navigate = useNavigate();
  const [platformData, setPlatformData] = useState<Record<string, PlatformData>>({});
  const [channelData, setChannelData] = useState<any>(null);

  useEffect(() => {
    // 加载外卖平台数据
    const latestData = takeoutPlatformsData[0]; // 获取最新数据
    const formattedData: Record<string, PlatformData> = {};
    
    latestData.platforms.forEach(platform => {
      const key = platform.platform_name === '美团' ? 'meituan' : 
                  platform.platform_name === '饿了么' ? 'eleme' : 'jingdong';
      
      formattedData[key] = {
        name: platform.platform_name,
        turnover: platform.turnover,
        orders: platform.orders,
        avgPrice: platform.avg_price,
        turnoverChange: platform.turnover_change_rate,
        ordersChange: platform.orders_change_rate,
        avgPriceChange: platform.avg_price_change_rate,
        marketShare: platform.market_share
      };
    });
    
    setPlatformData(formattedData);

    // 加载堂食数据
    const latestChannelData = channelAnalysisData[0];
    setChannelData(latestChannelData);
  }, []);

  // 渲染单个指标卡片（与首页核心业绩概览保持一致的小卡片样式）
  const renderMetricCard = (
    title: string,
    value: string | number,
    unit: string,
    changeRate: number,
    changeType: 'rate' | 'value' = 'rate'
  ) => {
    // 根据标题选择渐变背景色，与首页保持一致
    const gradient =
      title === '营业额'
        ? 'linear-gradient(135deg, #B45309 0%, #D97706 100%)' // 棕橙
        : title === '堂食客流' || title === '订单数'
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
              {typeof value === 'number' ? value.toString() : value}
              {unit && (
                <span className="ml-1 font-normal" style={{ fontSize: 'clamp(12px, 2.8vw, 14px)', opacity: 0.85 }}>
                  {unit}
                </span>
              )}
            </>
          )}
        </div>
        {changeRate !== 0 && (
          <div className="flex items-center justify-center whitespace-nowrap" style={{ fontSize: 'clamp(10px, 2.4vw, 14px)', color: 'rgba(255,255,255,0.95)' }}>
            {changeRate > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {changeType === 'value' ? (
              <span>
                {(changeRate > 0 ? '+' : changeRate < 0 ? '-' : '')}
                {(() => {
                  const base = typeof value === 'number' ? value : parseFloat(String(value));
                  const delta = Number(((Math.abs(base) * Math.abs(changeRate)) / 100).toFixed(1));
                  return `${delta}`;
                })()}元
              </span>
            ) : (
              <span>
                {(changeRate > 0 ? '+' : '')}{changeRate.toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // 渲染外卖平台的小卡片（移除大卡片包装）
  const renderPlatformCard = (platform: PlatformData) => {
    return (
      <div className="space-y-3">
        {renderMetricCard('营业额', platform.turnover, '元', platform.turnoverChange)}
        {renderMetricCard('订单数', platform.orders, '单', platform.ordersChange)}
        {renderMetricCard('客单价', platform.avgPrice, '元', platform.avgPriceChange)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar back="返回" onBack={() => navigate(-1)}>
        渠道分析详情页
      </NavBar>
      
      <div className="p-4 space-y-6">
        {/* 堂食数据区域 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 px-3">堂食</h3>
          <div className="px-3">
            <Grid columns={3} gap={8}>
              <Grid.Item>
                {channelData && renderMetricCard(
                  '营业额', 
                  channelData.dineInAvgPrice * channelData.dineInTraffic, 
                  '元', 
                  15.2 // 模拟堂食营业额环比数据
                )}
              </Grid.Item>
              <Grid.Item>
                {channelData && renderMetricCard(
                  '堂食客流', 
                  channelData.dineInTraffic, 
                  '人次', 
                  channelData.dineInTrafficChangeRate
                )}
              </Grid.Item>
              <Grid.Item>
                {channelData && renderMetricCard(
                  '堂食客单价', 
                  channelData.dineInAvgPrice, 
                  '元', 
                  channelData.dineInAvgPriceChange,
                  'value'
                )}
              </Grid.Item>
            </Grid>
          </div>
        </div>

        {/* 外卖渠道数据区域 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 px-3">外卖</h3>
          <div className="px-3 space-y-4">
            {/* 美团 */}
            <div>
              <div className="text-left mb-2">
                <h4 className="text-md font-semibold text-gray-700">美团</h4>
              </div>
              <div className="px-3">
                <Grid columns={3} gap={8}>
                  {platformData.meituan && (
                    <>
                      <Grid.Item>
                        {renderMetricCard('营业额', platformData.meituan.turnover, '元', platformData.meituan.turnoverChange)}
                      </Grid.Item>
                      <Grid.Item>
                        {renderMetricCard('订单数', platformData.meituan.orders, '单', platformData.meituan.ordersChange)}
                      </Grid.Item>
                      <Grid.Item>
                        {renderMetricCard('客单价', platformData.meituan.avgPrice, '元', platformData.meituan.avgPriceChange, 'value')}
                      </Grid.Item>
                    </>
                  )}
                </Grid>
              </div>
            </div>
            
            {/* 饿了么 */}
            <div>
              <div className="text-left mb-2">
                <h4 className="text-md font-semibold text-gray-700">饿了么</h4>
              </div>
              <div className="px-3">
                <Grid columns={3} gap={8}>
                  {platformData.eleme && (
                    <>
                      <Grid.Item>
                        {renderMetricCard('营业额', platformData.eleme.turnover, '元', platformData.eleme.turnoverChange)}
                      </Grid.Item>
                      <Grid.Item>
                        {renderMetricCard('订单数', platformData.eleme.orders, '单', platformData.eleme.ordersChange)}
                      </Grid.Item>
                      <Grid.Item>
                        {renderMetricCard('客单价', platformData.eleme.avgPrice, '元', platformData.eleme.avgPriceChange, 'value')}
                      </Grid.Item>
                    </>
                  )}
                </Grid>
              </div>
            </div>
            
            {/* 京东到家 */}
            <div>
              <div className="text-left mb-2">
                <h4 className="text-md font-semibold text-gray-700">京东</h4>
              </div>
              <div className="px-3">
                <Grid columns={3} gap={8}>
                  {platformData.jingdong && (
                    <>
                      <Grid.Item>
                        {renderMetricCard('营业额', platformData.jingdong.turnover, '元', platformData.jingdong.turnoverChange)}
                      </Grid.Item>
                      <Grid.Item>
                        {renderMetricCard('订单数', platformData.jingdong.orders, '单', platformData.jingdong.ordersChange)}
                      </Grid.Item>
                      <Grid.Item>
                        {renderMetricCard('客单价', platformData.jingdong.avgPrice, '元', platformData.jingdong.avgPriceChange, 'value')}
                      </Grid.Item>
                    </>
                  )}
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeoutPlatformDetail;