import React, { useState } from 'react';
import { Card, Tabs } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Crown, Award, Medal, Store, HelpCircle } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { formatCurrency, formatChangeRate, isPositiveChange, getChangeColorClass } from '../../utils/format';
import MetricDefinitionModal from '../common/MetricDefinitionModal';
import { MetricDefinition, getMetricDefinition } from '../../data/metricDefinitions';

const StoreRankingSection: React.FC = () => {
  const navigate = useNavigate();
  const { storeRanking } = useDashboardStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | undefined>(undefined);

  const handleMetricHelp = (metricId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const metric = getMetricDefinition(metricId);
    setSelectedMetric(metric);
    setModalVisible(true);
  };

  if (!storeRanking) {
    return (
      <Card className="mx-3 mb-3">
        <div className="p-3">
          <h2 className="text-base font-semibold mb-3 text-gray-900">门店梯度表现</h2>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 text-orange-500" />;
      default:
        return <Store className="w-4 h-4 text-gray-500" />;
    }
  };

  // 模拟末位10门店数据（实际应该从后端获取）
  const bottomStores = storeRanking.topStores.slice().reverse().slice(0, 10).map((store, index) => ({
    ...store,
    rank: index + 1,
    revenue: store.revenue * 0.3, // 模拟较低的营业额
    revenueChangeRate: store.revenueChangeRate * -1 // 模拟负增长
  }));

  return (
    <div className="space-y-3">
      <div className="mb-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="py-3">
            <div className="flex items-center justify-between mb-3 px-3">
              <div className="flex items-center">
                <h2 className="text-base font-semibold text-gray-900">门店梯度表现</h2>
                <HelpCircle 
                  className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                  onClick={(e) => handleMetricHelp('store_ranking', e)}
                />
              </div>
              <span className="text-xs text-yellow-600">当期营业额排名</span>
            </div>
            
            <div className="-mx-3">
              <div className="px-3">
          
          <Tabs className="compact-tabs">
            <Tabs.Tab title="top10门店" key="top-stores">
              <div className="space-y-2 mt-3">
                {storeRanking.topStores.slice(0, 10).map((store, index) => (
                  <div 
                    key={store.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => navigate(`/store/${store.id}`)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-1">
                        {getRankIcon(index + 1)}
                        <span className="text-xs font-medium text-gray-600">#{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{store.name}</div>
                        <div className="text-xs text-gray-500">{store.region}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 flex items-center">
                        <span>{formatCurrency(store.revenue)}</span>
                        <HelpCircle 
                          className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                          onClick={(e) => handleMetricHelp('store_revenue', e)}
                        />
                      </div>
                      <div className={`flex items-center text-xs ${getChangeColorClass(store.revenueChangeRate)}`}>
                        {isPositiveChange(store.revenueChangeRate) ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        <span>{formatChangeRate(store.revenueChangeRate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Tab>

            <Tabs.Tab title="末位10门店" key="bottom-stores">
              <div className="space-y-2 mt-3">
                {bottomStores.map((store) => (
                  <div 
                    key={store.id}
                    className="flex items-center justify-between p-2 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100"
                    onClick={() => navigate(`/store/${store.id}`)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-1">
                        <Store className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-medium text-red-600">#{store.rank}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{store.name}</div>
                        <div className="text-xs text-gray-500">{store.region}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 flex items-center">
                        <span>{formatCurrency(store.revenue)}</span>
                        <HelpCircle 
                          className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                          onClick={(e) => handleMetricHelp('store_revenue', e)}
                        />
                      </div>
                      <div className={`flex items-center text-xs ${getChangeColorClass(store.revenueChangeRate)}`}>
                        {isPositiveChange(store.revenueChangeRate) ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        <span>{formatChangeRate(store.revenueChangeRate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Tab>
          </Tabs>
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

export default StoreRankingSection;