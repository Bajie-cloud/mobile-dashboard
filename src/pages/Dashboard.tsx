import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../store/dashboardStore';
import DashboardHeader from '../components/DashboardHeader';
import CorePerformanceSection from '../components/sections/CorePerformanceSection';
import ChannelAnalysisSection from '../components/sections/ChannelAnalysisSection';
import RegionAnalysisSection from '../components/sections/RegionAnalysisSection';
import ProductAnalysisSection from '../components/sections/ProductAnalysisSection';
import StoreRankingSection from '../components/sections/StoreRankingSection';
import AlertSection from '../components/sections/AlertSection';
import BottomTabBar from '../components/BottomTabBar';
import DraggableFloatingButton from '../components/DraggableFloatingButton';

const Dashboard: React.FC = () => {
  const { loadAllData, sectionSettings } = useDashboardStore();
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [currentDate, setCurrentDate] = useState('10月31日（周五）');

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleStoreChange = (store: string) => {
    setSelectedStore(store);
    // 这里可以添加门店切换的逻辑
  };

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    // 这里可以添加日期范围切换的逻辑
  };

  const handleDateChange = (date: string) => {
    setCurrentDate(date);
    // 这里可以添加具体日期切换的逻辑
  };

  // 根据设置渲染section
  const renderSection = (sectionId: string) => {
    const setting = sectionSettings.find(s => s.id === sectionId);
    if (!setting || !setting.enabled) return null;

    switch (sectionId) {
      case 'corePerformance':
        return <CorePerformanceSection key={sectionId} />;
      case 'channelAnalysis':
        return <ChannelAnalysisSection key={sectionId} />;
      case 'regionAnalysis':
        return <RegionAnalysisSection key={sectionId} />;
      case 'productAnalysis':
        return <ProductAnalysisSection key={sectionId} />;
      case 'storeRanking':
        return <StoreRankingSection key={sectionId} />;
      case 'alertSection':
        return <AlertSection key={sectionId} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 固定顶部Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <DashboardHeader
          selectedStore={selectedStore}
          onStoreChange={handleStoreChange}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={handleDateRangeChange}
          currentDate={currentDate}
          onDateChange={handleDateChange}
        />
      </div>
      
      {/* 可滚动内容区域 - 确保底部有足够空间避免被菜单遮挡 */}
      <div className="content-area pb-24">
        {sectionSettings
          .filter(section => section.enabled)
          .sort((a, b) => a.order - b.order)
          .map(section => renderSection(section.id))
        }
      </div>

      {/* 可拖拽悬浮设置按钮 */}
      <DraggableFloatingButton onClick={() => navigate('/manage')} />

      {/* 底部菜单栏 - 固定在视口底部 */}
      <BottomTabBar />
    </div>
  );
};

export default Dashboard;