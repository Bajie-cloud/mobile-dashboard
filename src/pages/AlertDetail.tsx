import React, { useState, useEffect } from 'react';
import { NavBar, Card, Grid, Tag } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, TrendingDown, TrendingUp, Clock, CheckCircle, XCircle, Store, MapPin, Activity } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface AlertDetail {
  id: string;
  title: string;
  level: 'high' | 'medium' | 'low';
  type: string;
  triggerTime: string;
  currentValue: number;
  threshold: number;
  changeRate: number;
  affectedStores: Array<{
    id: string;
    name: string;
    region: string;
    impact: number;
  }>;
  status: 'pending' | 'processing' | 'resolved';
  description: string;
  suggestion: string;
}

const AlertDetail: React.FC = () => {
  const navigate = useNavigate();
  const { alertId } = useParams<{ alertId: string }>();
  const [alertData, setAlertData] = useState<AlertDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取预警详情数据
    const mockAlertData: AlertDetail = {
      id: alertId || '1',
      title: '营业额异常下降',
      level: 'high',
      type: '营业额预警',
      triggerTime: '2024-01-15 14:30:00',
      currentValue: 125000,
      threshold: 150000,
      changeRate: -16.7,
      affectedStores: [
        { id: '1', name: '朝阳门店', region: '北京朝阳区', impact: -25000 },
        { id: '2', name: '三里屯店', region: '北京朝阳区', impact: -18000 },
        { id: '3', name: '国贸店', region: '北京朝阳区', impact: -12000 },
        { id: '4', name: '望京店', region: '北京朝阳区', impact: -8500 },
        { id: '5', name: '建外SOHO店', region: '北京朝阳区', impact: -6200 },
        { id: '6', name: '大望路店', region: '北京朝阳区', impact: -4800 }
      ],
      status: 'pending',
      description: '今日营业额较昨日同期下降16.7%，已触发高级预警阈值。主要受朝阳区域6家门店影响，需要立即关注。',
      suggestion: '建议立即联系区域经理了解具体情况，检查是否有突发事件影响，并制定应对措施。重点关注朝阳门店和三里屯店的异常情况。'
    };
    
    setAlertData(mockAlertData);
    setLoading(false);
  }, [alertId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar 
          onBack={() => navigate(-1)}
          className="bg-white shadow-sm"
        >
          异常预警详情
        </NavBar>
        <div className="p-4">
          <div className="text-center text-gray-500 mt-20">
            加载中...
          </div>
        </div>
      </div>
    );
  }

  if (!alertData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar 
          onBack={() => navigate(-1)}
          className="bg-white shadow-sm"
        >
          异常预警详情
        </NavBar>
        <div className="p-4">
          <div className="text-center text-gray-500 mt-20">
            预警信息不存在
          </div>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'primary';
      default: return 'default';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'high': return '高级预警';
      case 'medium': return '中级预警';
      case 'low': return '低级预警';
      default: return '未知';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Activity className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'processing': return '处理中';
      case 'resolved': return '已解决';
      default: return '未知';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'primary';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar 
        onBack={() => navigate(-1)}
        className="bg-white shadow-sm"
      >
        异常预警详情
      </NavBar>
      
      <div className="p-4 space-y-4">
        {/* 预警概览卡片 */}
        <Card className="shadow-sm">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">{alertData.title}</h2>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Tag color={getLevelColor(alertData.level)} fill="outline">
                  {getLevelText(alertData.level)}
                </Tag>
                <Tag color={getStatusColor(alertData.status)} fill="outline">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(alertData.status)}
                    <span>{getStatusText(alertData.status)}</span>
                  </div>
                </Tag>
              </div>
              <div className="text-sm text-gray-500">
                {alertData.triggerTime}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-sm text-gray-600 mb-1">预警类型</div>
              <div className="font-medium text-gray-900">{alertData.type}</div>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed">
              {alertData.description}
            </div>
          </div>
        </Card>

        {/* 详细数据卡片 */}
        <Card className="shadow-sm">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <Activity className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-base font-semibold text-gray-900">数据详情</h3>
            </div>
            
            <Grid columns={2} gap={12}>
              <Grid.Item>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(alertData.currentValue)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">当前值</div>
                </div>
              </Grid.Item>
              <Grid.Item>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-600">
                    {formatCurrency(alertData.threshold)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">阈值</div>
                </div>
              </Grid.Item>
            </Grid>

            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center">
                {alertData.changeRate < 0 ? (
                  <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                )}
                <div className="text-center">
                  <div className={`text-lg font-bold ${alertData.changeRate < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {alertData.changeRate > 0 ? '+' : ''}{alertData.changeRate}%
                  </div>
                  <div className="text-xs text-gray-600">变化率</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 影响分析卡片 */}
        <Card className="shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Store className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-base font-semibold text-gray-900">受影响门店</h3>
              </div>
              <span className="text-xs text-gray-500">{alertData.affectedStores.length} 家门店</span>
            </div>
            
            <div className="space-y-3">
              {alertData.affectedStores
                .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                .map((store, index) => {
                  const isTopImpact = index < 3;
                  const rankColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500'];
                  const rankColor = isTopImpact ? rankColors[index] : 'bg-gray-400';
                  
                  return (
                    <div key={store.id} className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${isTopImpact ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* 排名指示器 */}
                          <div className={`flex items-center justify-center w-8 h-8 ${rankColor} rounded-full text-white font-bold text-sm`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            {/* 突出显示门店名称 */}
                            <div className={`font-bold ${isTopImpact ? 'text-xl text-red-900 bg-yellow-100 px-3 py-2 rounded-lg border-l-4 border-red-500' : 'text-lg text-gray-900'}`}>
                              <div className="flex items-center">
                                <Store className={`${isTopImpact ? 'w-5 h-5 text-red-600 mr-2' : 'w-4 h-4 text-gray-600 mr-2'}`} />
                                {store.name}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center mt-2">
                              <MapPin className="w-3 h-3 mr-1" />
                              {store.region}
                            </div>
                            {/* 影响程度标签 */}
                            {isTopImpact && (
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                  index === 0 ? 'bg-red-200 text-red-900 border border-red-400' :
                                  index === 1 ? 'bg-orange-200 text-orange-900 border border-orange-400' :
                                  'bg-yellow-200 text-yellow-900 border border-yellow-400'
                                }`}>
                                  {index === 0 ? '🔥 严重影响' : index === 1 ? '⚠️ 重要影响' : '📊 一般影响'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-red-600 ${isTopImpact ? 'text-lg' : 'text-base'}`}>
                            {formatCurrency(store.impact)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">影响金额</div>
                          {/* 影响占比 */}
                          <div className="text-xs text-gray-400 mt-1">
                            占比 {((Math.abs(store.impact) / Math.abs(alertData.affectedStores.reduce((sum, s) => sum + s.impact, 0))) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>

        {/* 处理建议卡片 */}
        <Card className="shadow-sm">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-base font-semibold text-gray-900">处理建议</h3>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-gray-700 leading-relaxed">
                {alertData.suggestion}
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              <button className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors">
                标记为处理中
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                联系相关人员
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AlertDetail;