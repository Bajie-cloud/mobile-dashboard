import React, { useEffect } from 'react';
import { NavBar, Card, Grid } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Store, DollarSign, Users } from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';
import { formatCurrency, formatChangeRate, isPositiveChange, getChangeColorClass } from '../utils/format';
import ReactECharts from 'echarts-for-react';

const CorePerformanceDetail: React.FC = () => {
  const navigate = useNavigate();
  const { corePerformance, loading, loadCorePerformance } = useDashboardStore();

  useEffect(() => {
    loadCorePerformance();
  }, [loadCorePerformance]);

  // 趋势图表配置
  const getTrendChartOption = () => {
    const dates = ['2024-01-13', '2024-01-14', '2024-01-15'];
    const revenueData = [2850000, 2920000, 3120000];
    const storeData = [145, 147, 148];

    return {
      title: {
        text: '核心业绩趋势',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['总营收', '活跃门店数'],
        bottom: 10
      },
      xAxis: {
        type: 'category',
        data: dates.map(date => date.slice(5))
      },
      yAxis: [
        {
          type: 'value',
          name: '营收(万元)',
          position: 'left',
          axisLabel: {
            formatter: (value: number) => (value / 10000).toFixed(0)
          }
        },
        {
          type: 'value',
          name: '门店数',
          position: 'right'
        }
      ],
      series: [
        {
          name: '总营收',
          type: 'line',
          yAxisIndex: 0,
          data: revenueData,
          smooth: true,
          lineStyle: {
            color: '#1890ff',
            width: 3
          },
          itemStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '活跃门店数',
          type: 'line',
          yAxisIndex: 1,
          data: storeData,
          smooth: true,
          lineStyle: {
            color: '#52c41a',
            width: 3
          },
          itemStyle: {
            color: '#52c41a'
          }
        }
      ]
    };
  };

  if (loading || !corePerformance) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar onBack={() => navigate(-1)}>
          核心业绩详情
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
        核心业绩详情
      </NavBar>

      <div className="px-3 py-4 space-y-4">
        {/* 核心指标卡片 */}
        <Grid columns={1} gap={12}>
          <Grid.Item>
            <Card className="card-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Store className="w-6 h-6 text-blue-500 mr-2" />
                    <span className="text-lg font-semibold">活跃门店数</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {corePerformance.activeStores.value}
                    </div>
                    <div className={`flex items-center text-sm mt-1 ${getChangeColorClass(corePerformance.activeStores.changeRate)}`}>
                      {isPositiveChange(corePerformance.activeStores.changeRate) ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {formatChangeRate(corePerformance.activeStores.changeRate)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Grid.Item>

          <Grid.Item>
            <Card className="card-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-green-500 mr-2" />
                    <span className="text-lg font-semibold">总营收</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(corePerformance.totalRevenue.value)}
                    </div>
                    <div className={`flex items-center text-sm mt-1 ${getChangeColorClass(corePerformance.totalRevenue.changeRate)}`}>
                      {isPositiveChange(corePerformance.totalRevenue.changeRate) ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {formatChangeRate(corePerformance.totalRevenue.changeRate)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Grid.Item>

          <Grid.Item>
            <Card className="card-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-purple-500 mr-2" />
                    <span className="text-lg font-semibold">平均门店营收</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(corePerformance.avgStoreRevenue.value)}
                    </div>
                    <div className={`flex items-center text-sm mt-1 ${getChangeColorClass(corePerformance.avgStoreRevenue.changeRate)}`}>
                      {isPositiveChange(corePerformance.avgStoreRevenue.changeRate) ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {formatChangeRate(corePerformance.avgStoreRevenue.changeRate)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Grid.Item>
        </Grid>

        {/* 趋势图表 */}
        <Card className="card-shadow">
          <div className="p-4">
            <div className="chart-container">
              <ReactECharts 
                option={getTrendChartOption()}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </div>
        </Card>

        {/* 详细分析 */}
        <Card className="card-shadow">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">业绩分析</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-900">门店运营稳定：</span>
                  活跃门店数保持在148家，较昨日增长{formatChangeRate(corePerformance.activeStores.changeRate)}，显示门店运营状况良好。
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-900">营收增长强劲：</span>
                  总营收达到{formatCurrency(corePerformance.totalRevenue.value)}，同比增长{formatChangeRate(corePerformance.totalRevenue.changeRate)}，超出预期目标。
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-900">单店效率提升：</span>
                  平均门店营收{formatCurrency(corePerformance.avgStoreRevenue.value)}，增长{formatChangeRate(corePerformance.avgStoreRevenue.changeRate)}，单店运营效率持续优化。
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CorePerformanceDetail;