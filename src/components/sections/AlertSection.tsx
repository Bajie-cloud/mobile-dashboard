import React, { useState } from 'react';
import { List, Badge } from 'antd-mobile';
import { formatCurrency, formatChangeRate } from '../../utils/format';
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  DollarSign, 
  AlertCircle, 
  Package,
  HelpCircle
} from 'lucide-react';
import MetricDefinitionModal from '../common/MetricDefinitionModal';
import { MetricDefinition, getMetricDefinition } from '../../data/metricDefinitions';

const AlertSection: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | undefined>(undefined);

  const handleMetricHelp = (metricId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const metric = getMetricDefinition(metricId);
    setSelectedMetric(metric);
    setModalVisible(true);
  };

  // 根据指标文档定义的5种预警类型生成模拟数据
  const generateAlerts = () => {
    return [
      {
        id: "alert_001",
        type: "total_revenue_drop",
        level: "high",
        title: "门店当期总营业额降幅预警",
        description: "上海南京路店当期总营业额环比昨日降幅52%，超过50%预警阈值",
        storeId: "store_001",
        storeName: "上海南京路店",
        region: "华东区",
        currentValue: 7600,
        previousValue: 15800,
        changeRate: -52.0,
        threshold: -50.0,
        timestamp: "2024-01-15T14:30:00Z",
        status: "pending"
      },
      {
        id: "alert_002",
        type: "dine_in_traffic_drop",
        level: "high",
        title: "门店当期堂食客流降幅预警",
        description: "深圳福田中心店当期堂食来客环比昨日降幅55%，超过50%预警阈值",
        storeId: "store_002",
        storeName: "深圳福田中心店",
        region: "华南区",
        currentValue: 280,
        previousValue: 625,
        changeRate: -55.2,
        threshold: -50.0,
        timestamp: "2024-01-15T13:45:00Z",
        status: "pending"
      },
      {
        id: "alert_003",
        type: "takeout_orders_drop",
        level: "high",
        title: "门店当期外卖订单数降幅预警",
        description: "北京王府井店当期外卖订单数环比昨日降幅51%，超过50%预警阈值",
        storeId: "store_003",
        storeName: "北京王府井店",
        region: "华北区",
        currentValue: 145,
        previousValue: 295,
        changeRate: -50.8,
        threshold: -50.0,
        timestamp: "2024-01-15T12:20:00Z",
        status: "investigating"
      },
      {
        id: "alert_004",
        type: "takeout_revenue_ratio_high",
        level: "medium",
        title: "门店当期外卖实收营业额占比预警",
        description: "广州天河店当期外卖实收营业额占当期总营业比达85%，超过80%预警阈值",
        storeId: "store_004",
        storeName: "广州天河店",
        region: "华南区",
        currentValue: 85.0,
        previousValue: 65.0,
        changeRate: 20.0,
        threshold: 80.0,
        timestamp: "2024-01-15T11:15:00Z",
        status: "pending"
      },
      {
        id: "alert_005",
        type: "takeout_revenue_ratio_low",
        level: "medium",
        title: "门店当期外卖实收营业额占比预警",
        description: "杭州西湖店当期外卖实收营业额占当期总营业比仅3%，在0%-5%预警范围内",
        storeId: "store_005",
        storeName: "杭州西湖店",
        region: "华东区",
        currentValue: 3.0,
        previousValue: 12.0,
        changeRate: -75.0,
        threshold: 5.0,
        timestamp: "2024-01-15T10:30:00Z",
        status: "pending"
      }
    ];
  };

  const alerts = generateAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'total_revenue_drop':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'dine_in_traffic_drop':
        return <Users className="w-5 h-5 text-orange-500" />;
      case 'takeout_orders_drop':
        return <Package className="w-5 h-5 text-red-500" />;
      case 'takeout_revenue_ratio_high':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      case 'takeout_revenue_ratio_low':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'primary';
      default:
        return 'default';
    }
  };



  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatValue = (type: string, value: number) => {
    if (type.includes('revenue') && !type.includes('ratio')) {
      return formatCurrency(value);
    } else if (type.includes('ratio')) {
      return `${value.toFixed(1)}%`;
    } else {
      return value.toLocaleString();
    }
  };



  return (
    <div className="space-y-3">
      <div className="mb-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="py-3">
            <div className="flex items-center justify-between mb-3 px-3">
              <div className="flex items-center">
                <h2 className="text-sm font-semibold text-gray-900 whitespace-nowrap">异常预警</h2>
                <HelpCircle 
                  className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                  onClick={(e) => handleMetricHelp('anomaly_warning', e)}
                />
              </div>
              <span className="text-xs text-yellow-600">实时监控</span>
            </div>
            
            <div className="-mx-3">
              <div className="px-3">
                <div className="flex items-center mb-3">
                  <h3 className="text-xs font-semibold text-gray-800 ml-[2ch] whitespace-nowrap">预警详情</h3>
                  <HelpCircle 
                    className="w-3 h-3 ml-1 text-yellow-500 cursor-pointer hover:text-yellow-600" 
                    onClick={(e) => handleMetricHelp('alert_details', e)}
                  />
                </div>
          <List>
            {alerts.map((alert) => (
              <List.Item
                key={alert.id}
                prefix={getAlertIcon(alert.type)}
                arrow={false}
                description={
                  <div className="space-y-2">
                    <div className="text-xs text-gray-700">{alert.description}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">门店</span>
                      <span className="text-xs font-medium">{alert.storeName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">区域</span>
                      <span className="text-xs">{alert.region}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-gray-600">当前值</span>
                       <span className="text-xs font-medium">
                         {formatValue(alert.type, alert.currentValue)}
                       </span>
                     </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">变化幅度</span>
                      <span className="text-xs font-medium text-red-600">
                        {formatChangeRate(alert.changeRate)}
                      </span>
                    </div>
                  </div>
                }
                onClick={() => {
                  console.log(`Navigate to alert ${alert.id} details`);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm whitespace-nowrap">{alert.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <Badge content={alert.level} color={getAlertLevelColor(alert.level)} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {formatTimestamp(alert.timestamp)}
                    </div>
                  </div>
                </div>
              </List.Item>
            ))}
                </List>
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

export default AlertSection;