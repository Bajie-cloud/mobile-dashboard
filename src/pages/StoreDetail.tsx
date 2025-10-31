import React, { useEffect, useState } from 'react';
import { NavBar, Card, Grid, Tabs } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { Store, MapPin, Phone, Clock, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { formatCurrency, formatChangeRate, isPositiveChange, getChangeColorClass } from '../utils/format';
import ReactECharts from 'echarts-for-react';

interface StoreDetailData {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  openTime: string;
  revenue: {
    today: number;
    yesterday: number;
    changeRate: number;
  };
  traffic: {
    today: number;
    yesterday: number;
    changeRate: number;
  };
  avgPrice: {
    today: number;
    yesterday: number;
    changeRate: number;
  };
  hourlyData: Array<{
    hour: string;
    revenue: number;
    traffic: number;
  }>;
  categoryData: Array<{
    name: string;
    revenue: number;
    percentage: number;
  }>;
}

const StoreDetail: React.FC = () => {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const [storeData, setStoreData] = useState<StoreDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取门店详情数据
    const fetchStoreDetail = async () => {
      setLoading(true);
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: StoreDetailData = {
        id: storeId || '001',
        name: '北京朝阳门店',
        address: '北京市朝阳区朝阳门外大街123号',
        phone: '010-12345678',
        manager: '张经理',
        openTime: '08:00-22:00',
        revenue: {
          today: 28500,
          yesterday: 26800,
          changeRate: 6.34
        },
        traffic: {
          today: 342,
          yesterday: 318,
          changeRate: 7.55
        },
        avgPrice: {
          today: 83.33,
          yesterday: 84.28,
          changeRate: -1.13
        },
        hourlyData: [
          { hour: '08:00', revenue: 1200, traffic: 15 },
          { hour: '09:00', revenue: 1800, traffic: 22 },
          { hour: '10:00', revenue: 2200, traffic: 28 },
          { hour: '11:00', revenue: 3200, traffic: 38 },
          { hour: '12:00', revenue: 4500, traffic: 52 },
          { hour: '13:00', revenue: 3800, traffic: 45 },
          { hour: '14:00', revenue: 2800, traffic: 35 },
          { hour: '15:00', revenue: 2200, traffic: 28 },
          { hour: '16:00', revenue: 2600, traffic: 32 },
          { hour: '17:00', revenue: 3400, traffic: 42 },
          { hour: '18:00', revenue: 4200, traffic: 48 },
          { hour: '19:00', revenue: 3600, traffic: 44 },
          { hour: '20:00', revenue: 2800, traffic: 35 },
          { hour: '21:00', revenue: 2100, traffic: 26 }
        ],
        categoryData: [
          { name: '主食类', revenue: 12500, percentage: 43.9 },
          { name: '饮品类', revenue: 8200, percentage: 28.8 },
          { name: '小食类', revenue: 4800, percentage: 16.8 },
          { name: '甜品类', revenue: 3000, percentage: 10.5 }
        ]
      };
      
      setStoreData(mockData);
      setLoading(false);
    };

    fetchStoreDetail();
  }, [storeId]);

  // 小时营收趋势图
  const getHourlyRevenueOption = () => {
    if (!storeData) return {};

    return {
      title: {
        text: '今日小时营收趋势',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>营收: ¥${data.value.toLocaleString()}<br/>客流: ${storeData.hourlyData[data.dataIndex].traffic}人`;
        }
      },
      xAxis: {
        type: 'category',
        data: storeData.hourlyData.map(item => item.hour),
        axisLabel: {
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: '营收(元)',
        axisLabel: {
          formatter: (value: number) => `¥${(value / 1000).toFixed(1)}k`
        }
      },
      series: [
        {
          data: storeData.hourlyData.map(item => item.revenue),
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#1890ff',
            width: 2
          },
          itemStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
              ]
            }
          }
        }
      ]
    };
  };

  // 品类销售占比图
  const getCategoryOption = () => {
    if (!storeData) return {};

    return {
      title: {
        text: '品类销售占比',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
      },
      series: [
        {
          name: '销售额',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          data: storeData.categoryData.map(item => ({
            value: item.revenue,
            name: item.name
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%'
          }
        }
      ]
    };
  };

  if (loading || !storeData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar onBack={() => navigate(-1)}>
          门店详情
        </NavBar>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar 
        onBack={() => navigate(-1)}
        className="bg-white shadow-sm"
      >
        门店详情
      </NavBar>

      <div className="px-3 py-4 space-y-4">
        {/* 门店基本信息 */}
        <Card className="card-shadow">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <Store className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{storeData.name}</h2>
                <p className="text-sm text-gray-500">门店编号: {storeData.id}</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{storeData.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{storeData.phone}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">营业时间: {storeData.openTime}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">店长: {storeData.manager}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 今日业绩指标 */}
        <Grid columns={3} gap={8}>
          <Grid.Item>
            <Card className="card-shadow">
              <div className="p-3 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(storeData.revenue.today)}
                </div>
                <div className="text-xs text-gray-500 mb-1">今日营收</div>
                <div className={`text-xs flex items-center justify-center ${getChangeColorClass(storeData.revenue.changeRate)}`}>
                  {isPositiveChange(storeData.revenue.changeRate) ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {formatChangeRate(storeData.revenue.changeRate)}
                </div>
              </div>
            </Card>
          </Grid.Item>

          <Grid.Item>
            <Card className="card-shadow">
              <div className="p-3 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {storeData.traffic.today}
                </div>
                <div className="text-xs text-gray-500 mb-1">今日客流</div>
                <div className={`text-xs flex items-center justify-center ${getChangeColorClass(storeData.traffic.changeRate)}`}>
                  {isPositiveChange(storeData.traffic.changeRate) ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {formatChangeRate(storeData.traffic.changeRate)}
                </div>
              </div>
            </Card>
          </Grid.Item>

          <Grid.Item>
            <Card className="card-shadow">
              <div className="p-3 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ¥{storeData.avgPrice.today.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500 mb-1">客单价</div>
                <div className={`text-xs flex items-center justify-center ${getChangeColorClass(storeData.avgPrice.changeRate)}`}>
                  {isPositiveChange(storeData.avgPrice.changeRate) ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {formatChangeRate(storeData.avgPrice.changeRate)}
                </div>
              </div>
            </Card>
          </Grid.Item>
        </Grid>

        {/* 详细分析 */}
        <Tabs defaultActiveKey="hourly">
          <Tabs.Tab title="小时趋势" key="hourly">
            <Card className="card-shadow">
              <div className="p-4">
                <div className="chart-container">
                  <ReactECharts 
                    option={getHourlyRevenueOption()}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              </div>
            </Card>
          </Tabs.Tab>

          <Tabs.Tab title="品类分析" key="category">
            <Card className="card-shadow">
              <div className="p-4">
                <div className="chart-container">
                  <ReactECharts 
                    option={getCategoryOption()}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
                
                <div className="mt-4 space-y-2">
                  {storeData.categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">{formatCurrency(item.revenue)}</div>
                        <div className="text-xs text-gray-500">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Tabs.Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default StoreDetail;