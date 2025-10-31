import React, { useRef, useEffect, useState } from 'react';
import { Card, Grid, Tabs } from 'antd-mobile';
import * as echarts from 'echarts';
import { useDashboardStore } from '../../store/dashboardStore';
import { formatCurrency, formatChangeRate, getChangeColorClass, isPositiveChange } from '../../utils/format';
import { TrendingUp, TrendingDown, Package, Award, HelpCircle } from 'lucide-react';
import MetricDefinitionModal from '../common/MetricDefinitionModal';
import { MetricDefinition, getMetricDefinition } from '../../data/metricDefinitions';

const ProductAnalysisSection: React.FC = () => {
  const { productSales } = useDashboardStore();
  const categoryChartRef = useRef<HTMLDivElement>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | undefined>(undefined);

  const handleMetricHelp = (metricId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const metric = getMetricDefinition(metricId);
    setSelectedMetric(metric);
    setModalVisible(true);
  };

  useEffect(() => {
    if (!productSales || !categoryChartRef.current) return;

    const chart = echarts.init(categoryChartRef.current);
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center',
        textStyle: {
          fontSize: 9
        }
      },
      series: [
        {
          name: '营业额',
          type: 'pie',
          radius: ['25%', '55%'],
          center: ['50%', '40%'],
          data: productSales.categories.map((category, index) => ({
            value: category.revenue,
            name: category.name,
            itemStyle: {
              color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
            }
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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
  }, [productSales]);

  if (!productSales) {
    return (
      <Card className="mx-3 mb-3">
        <div className="p-3">
          <h2 className="text-base font-semibold mb-3 text-gray-900">菜品分析</h2>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  // 分离单品和套餐数据
  const singleItems = productSales.topProducts.filter(product => !product.name.includes('套餐')).slice(0, 5);
  const comboItems = productSales.topProducts.filter(product => product.name.includes('套餐')).slice(0, 3);

  return (
    <div className="space-y-3">
      {/* 菜品分析 - 合并的卡片 */}
      <Card className="mx-3">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-gray-900">菜品分析</h2>
              <HelpCircle 
                className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                onClick={(e) => handleMetricHelp('product_analysis', e)}
              />
            </div>
            <span className="text-xs text-gray-600">当日销量排名</span>
          </div>
          
          <Tabs className="compact-tabs">
            <Tabs.Tab title="Top5单品" key="single-products">
              <div className="space-y-2 mt-3">
                {singleItems.map((product, index) => (
                  <div key={product.name} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
                          <Package className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                        <span className="text-xs font-bold text-blue-600">TOP {index + 1}</span>
                      </div>
                      <div className={`flex items-center text-xs ${getChangeColorClass(product.revenueChangeRate)}`}>
                        {isPositiveChange(product.revenueChangeRate) ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        <span>{formatChangeRate(product.revenueChangeRate)}</span>
                      </div>
                    </div>
                    
                    <Grid columns={2} gap={8}>
                      <Grid.Item>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                            <span>营业额</span>
                            <HelpCircle 
                              className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                              onClick={(e) => handleMetricHelp('product_revenue', e)}
                            />
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {formatCurrency(product.revenue)}
                          </div>
                        </div>
                      </Grid.Item>
                      <Grid.Item>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                            <span>销量</span>
                            <HelpCircle 
                              className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                              onClick={(e) => handleMetricHelp('product_sales_volume', e)}
                            />
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {product.orderCount.toLocaleString()}份
                          </div>
                        </div>
                      </Grid.Item>
                    </Grid>
                  </div>
                ))}
              </div>
            </Tabs.Tab>

            <Tabs.Tab title="Top3套餐" key="combo-products">
              <div className="space-y-2 mt-3">
                {comboItems.map((product, index) => (
                  <div key={product.name} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100">
                          <Award className="w-3 h-3 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                        <span className="text-xs font-bold text-orange-600">TOP {index + 1}</span>
                      </div>
                      <div className={`flex items-center text-xs ${getChangeColorClass(product.revenueChangeRate)}`}>
                        {isPositiveChange(product.revenueChangeRate) ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        <span>{formatChangeRate(product.revenueChangeRate)}</span>
                      </div>
                    </div>
                    
                    <Grid columns={2} gap={8}>
                      <Grid.Item>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                            <span>营业额</span>
                            <HelpCircle 
                              className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                              onClick={(e) => handleMetricHelp('product_revenue', e)}
                            />
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {formatCurrency(product.revenue)}
                          </div>
                        </div>
                      </Grid.Item>
                      <Grid.Item>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                            <span>销量</span>
                            <HelpCircle 
                              className="w-3 h-3 ml-1 text-blue-500 cursor-pointer hover:text-blue-600" 
                              onClick={(e) => handleMetricHelp('product_sales_volume', e)}
                            />
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {product.orderCount.toLocaleString()}份
                          </div>
                        </div>
                      </Grid.Item>
                    </Grid>
                  </div>
                ))}
              </div>
            </Tabs.Tab>
          </Tabs>
        </div>
      </Card>

      {/* 指标定义弹窗 */}
      <MetricDefinitionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        metric={selectedMetric}
      />
    </div>
  );
};

export default ProductAnalysisSection;