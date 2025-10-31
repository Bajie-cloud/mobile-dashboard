import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardHeaderProps {
  selectedStore: string;
  onStoreChange: (store: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (range: string) => void;
  currentDate: string;
  onDateChange: (date: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedStore,
  onStoreChange,
  selectedDateRange,
  onDateRangeChange,
  currentDate,
  onDateChange
}) => {
  const [showStoreSelector, setShowStoreSelector] = useState(false);

  const storeOptions = [
    { label: '筛选(10家)门店', value: 'all' },
    { label: '朝阳门店', value: 'chaoyangmen' },
    { label: '三里屯店', value: 'sanlitun' },
    { label: '国贸店', value: 'guomao' },
    { label: '望京店', value: 'wangjing' },
    { label: '西单店', value: 'xidan' }
  ];

  const dateRangeOptions = [
    { label: '今日', value: 'today' },
    { label: '近7日', value: 'week' },
    { label: '近30日', value: 'month' },
    { label: '选择日期', value: 'custom' }
  ];

  const handlePrevDate = () => {
    // 实现日期切换逻辑
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    const newDate = currentDateObj.toISOString().split('T')[0];
    onDateChange(newDate);
  };

  const handleNextDate = () => {
    // 实现日期切换逻辑
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + 1);
    const newDate = currentDateObj.toISOString().split('T')[0];
    onDateChange(newDate);
  };

  return (
    <div className="dashboard-header">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold text-gray-900">移动报表</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* AI助手标识 */}
          <div className="ai-assistant">
            <div className="ai-icon">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span className="ai-text">AI助手</span>
          </div>
          
          {/* 门店筛选器 */}
          <div className="relative">
            <button
              className="store-selector"
              onClick={() => setShowStoreSelector(true)}
            >
              <span className="text-sm text-gray-700">筛选(10家)门店</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* 日期选择器 */}
      <div className="px-4 py-3 bg-gray-50">
        {/* 日期范围选项卡 */}
        <div className="flex space-x-2 mb-3">
          {dateRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onDateRangeChange(option.value)}
              className={`date-selector-btn ${
                selectedDateRange === option.value ? 'active' : 'inactive'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 具体日期显示 */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handlePrevDate}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          
          <span className="text-sm text-gray-600 font-medium">
            {currentDate}
          </span>
          
          <button
            onClick={handleNextDate}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 门店选择器弹窗 */}
      {showStoreSelector && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white w-full rounded-t-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">选择门店</h3>
              <button
                onClick={() => setShowStoreSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {storeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onStoreChange(option.value);
                    setShowStoreSelector(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedStore === option.value
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;