import React, { useState } from 'react';
import { NavBar, List, Switch, Button, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';

const ManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { sectionSettings, updateSectionSettings, reorderSections } = useDashboardStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleBack = () => {
    navigate('/');
  };

  const handleSave = () => {
    Toast.show({
      content: '设置已保存',
      position: 'center',
    });
    navigate('/');
  };

  const handleToggleSection = (sectionId: string, enabled: boolean) => {
    updateSectionSettings(sectionId, { enabled });
  };

  const handleMoveUp = (sectionId: string) => {
    const currentIndex = sectionSettings.findIndex(s => s.id === sectionId);
    if (currentIndex > 0) {
      reorderSections(currentIndex, currentIndex - 1);
    }
  };

  const handleMoveDown = (sectionId: string) => {
    const currentIndex = sectionSettings.findIndex(s => s.id === sectionId);
    if (currentIndex < sectionSettings.length - 1) {
      reorderSections(currentIndex, currentIndex + 1);
    }
  };

  // 拖拽处理函数
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderSections(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar
        back={<ArrowLeft className="w-5 h-5" />}
        onBack={handleBack}
        right={
          <Button
            size="small"
            color="primary"
            fill="solid"
            onClick={handleSave}
          >
            保存
          </Button>
        }
      >
        页面指标管理
      </NavBar>

      <div className="p-4">
        <div className="mb-4 text-sm text-gray-600">
          您可以拖拽 ⋮⋮ 图标或使用上下箭头调整各个指标数据的显示顺序，
          若选择关闭部分指标数据，相应入口将隐藏，但不
          会清空任何历史数据。
        </div>

        <List>
          {sectionSettings.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                transition-all duration-200
                ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                ${dragOverIndex === index && draggedIndex !== index ? 'border-t-2 border-blue-500' : ''}
              `}
            >
              <List.Item
                prefix={
                  <div className="flex items-center space-x-2">
                    <div className="cursor-move">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex flex-col bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMoveUp(section.id)}
                        className={`w-6 h-4 flex items-center justify-center transition-all border-b border-gray-200 ${
                          index === 0 
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100'
                        }`}
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        disabled={index === sectionSettings.length - 1}
                        onClick={() => handleMoveDown(section.id)}
                        className={`w-6 h-4 flex items-center justify-center transition-all ${
                          index === sectionSettings.length - 1
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100'
                        }`}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                }
                extra={
                  <Switch
                    checked={section.enabled}
                    onChange={(checked) => handleToggleSection(section.id, checked)}
                  />
                }
              >
                {section.name}
              </List.Item>
            </div>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ManagePage;