import React, { useState, useEffect } from 'react';
import { NavBar, Card, Grid } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { Store, MapPin } from 'lucide-react';
import { RegionStoreData, StoreDetail } from '../types';
import { formatCurrency } from '../utils/format';
import storeData from '../data/storeData.json';

const RegionAnalysisDetail: React.FC = () => {
  const navigate = useNavigate();
  const { regionName } = useParams<{ regionName: string }>();
  const [stores, setStores] = useState<StoreDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (regionName) {
      const decodedRegionName = decodeURIComponent(regionName);
      const regionStoreData = storeData as RegionStoreData;
      const regionStores = regionStoreData[decodedRegionName] || [];
      
      // 按营业额降序排序
      const sortedStores = regionStores.sort((a, b) => b.revenue - a.revenue);
      setStores(sortedStores);
    }
    setLoading(false);
  }, [regionName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar 
          onBack={() => navigate(-1)}
          className="bg-white shadow-sm"
        >
          区域门店详情
        </NavBar>
        <div className="p-4">
          <div className="text-center text-gray-500 mt-20">
            加载中...
          </div>
        </div>
      </div>
    );
  }

  const decodedRegionName = regionName ? decodeURIComponent(regionName) : '';
  const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0);
  const avgRevenue = stores.length > 0 ? totalRevenue / stores.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar 
        onBack={() => navigate(-1)}
        className="bg-white shadow-sm"
      >
        {decodedRegionName}门店详情
      </NavBar>
      
      <div className="p-4 space-y-4">
        {/* 区域概览卡片 */}
        <Card className="shadow-sm">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 text-primary-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">{decodedRegionName}</h2>
            </div>
            
            <Grid columns={3} gap={12}>
              <Grid.Item>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {stores.length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">门店数量</div>
                </div>
              </Grid.Item>
              <Grid.Item>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(totalRevenue)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">总营业额</div>
                </div>
              </Grid.Item>
              <Grid.Item>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {formatCurrency(avgRevenue)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">平均营业额</div>
                </div>
              </Grid.Item>
            </Grid>
          </div>
        </Card>

        {/* 门店列表 */}
        <Card className="shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">门店列表</h3>
              <span className="text-xs text-gray-500">按营业额排序</span>
            </div>
            
            <div className="space-y-3">
              {stores.map((store, index) => (
                <div key={store.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  {/* 主要信息：门店名称和营业额 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full">
                        <Store className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{store.name}</div>
                        <div className="text-sm text-primary-600 font-medium">#{index + 1} 排名</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(store.revenue)}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">营业额</div>
                    </div>
                  </div>
                  
                  {/* 次要信息：省份城市和地址 - 弱化显示 */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>{store.province}</span>
                        <span>•</span>
                        <span>{store.city}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-32">{store.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {stores.length === 0 && (
              <div className="text-center py-8">
                <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <div className="text-gray-500">该区域暂无门店数据</div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegionAnalysisDetail;