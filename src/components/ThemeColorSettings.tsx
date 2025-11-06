import React, { useState } from 'react';
import { List, Button, Toast } from 'antd-mobile';
import { useDashboardStore } from '../store/dashboardStore';
import { Palette, RotateCcw } from 'lucide-react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange, presetColors }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (color: string) => {
    onChange(color);
    setShowPicker(false);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-2">
        {/* 颜色预览 */}
        <div 
          className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        />
        
        {/* 颜色输入框 */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
          placeholder="#000000"
        />
      </div>
      
      {/* 颜色选择器弹窗 */}
      {showPicker && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 right-0 top-full mt-1">
          <div className="space-y-2">
            {/* 预设颜色 */}
            {presetColors && (
              <div className="grid grid-cols-6 gap-1 mb-2">
                {presetColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            )}
            
            {/* 颜色输入 */}
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={value}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-8 h-8 border-none rounded cursor-pointer"
              />
              <span className="text-xs text-gray-500">{value}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ThemeColorSettingsProps {
  className?: string;
}

const ThemeColorSettings: React.FC<ThemeColorSettingsProps> = ({ className = '' }) => {
  const { themeColors, updateThemeColors, resetThemeColors } = useDashboardStore();

  // 预设颜色方案
  const colorPresets = [
    { name: '经典蓝', colors: { primary: '#3b82f6', secondary1: '#f59e0b', secondary2: '#10b981', secondary3: '#8b5cf6' } },
    { name: '活力橙', colors: { primary: '#f97316', secondary1: '#eab308', secondary2: '#22c55e', secondary3: '#3b82f6' } },
    { name: '商务绿', colors: { primary: '#059669', secondary1: '#d97706', secondary2: '#6366f1', secondary3: '#ec4899' } },
    { name: '优雅紫', colors: { primary: '#7c3aed', secondary1: '#f59e0b', secondary2: '#10b981', secondary3: '#ef4444' } },
  ];

  // 常用预设颜色
  const commonColors = [
    '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
    '#f97316', '#06b6d4', '#84cc16', '#f43f5e', '#6366f1',
    '#14b8a6', '#eab308', '#22c55e', '#ec4899', '#059669'
  ];

  const handleColorChange = (key: keyof typeof themeColors, value: string) => {
    updateThemeColors({ [key]: value });
  };

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    updateThemeColors(preset.colors);
    Toast.show({
      content: `已应用 ${preset.name} 主题`,
      position: 'center',
      duration: 1000,
    });
  };

  const handleReset = () => {
    resetThemeColors();
    Toast.show({
      content: '已重置为默认主题',
      position: 'center',
      duration: 1000,
    });
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">主题颜色设置</h3>
          </div>
          <Button
            size="small"
            fill="outline"
            onClick={handleReset}
            className="flex items-center space-x-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置</span>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 预设方案 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">预设方案</h4>
          <div className="grid grid-cols-2 gap-2">
            {colorPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetSelect(preset)}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left"
              >
                <div className="text-sm font-medium text-gray-700 mb-2">{preset.name}</div>
                <div className="flex space-x-1">
                  {Object.values(preset.colors).map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 主色调 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">主色调</h4>
          <ColorInput
            label="主色"
            value={themeColors.primary}
            onChange={(value) => handleColorChange('primary', value)}
            presetColors={commonColors}
          />
        </div>

        {/* 辅助色 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">辅助色</h4>
          <div className="space-y-2">
            <ColorInput
              label="辅助色1"
              value={themeColors.secondary1}
              onChange={(value) => handleColorChange('secondary1', value)}
              presetColors={commonColors}
            />
            <ColorInput
              label="辅助色2"
              value={themeColors.secondary2}
              onChange={(value) => handleColorChange('secondary2', value)}
              presetColors={commonColors}
            />
            <ColorInput
              label="辅助色3"
              value={themeColors.secondary3}
              onChange={(value) => handleColorChange('secondary3', value)}
              presetColors={commonColors}
            />
          </div>
        </div>

        {/* 功能色 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">功能色</h4>
          <div className="space-y-2">
            <ColorInput
              label="成功色"
              value={themeColors.success}
              onChange={(value) => handleColorChange('success', value)}
              presetColors={commonColors}
            />
            <ColorInput
              label="警告色"
              value={themeColors.warning}
              onChange={(value) => handleColorChange('warning', value)}
              presetColors={commonColors}
            />
            <ColorInput
              label="危险色"
              value={themeColors.danger}
              onChange={(value) => handleColorChange('danger', value)}
              presetColors={commonColors}
            />
          </div>
        </div>

        {/* 背景色 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">背景色</h4>
          <div className="space-y-2">
            <ColorInput
              label="卡片背景"
              value={themeColors.cardBackground}
              onChange={(value) => handleColorChange('cardBackground', value)}
              presetColors={['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb']}
            />
            <ColorInput
              label="页面背景"
              value={themeColors.pageBackground}
              onChange={(value) => handleColorChange('pageBackground', value)}
              presetColors={['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb']}
            />
          </div>
        </div>

        {/* 文字色 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">文字色</h4>
          <div className="space-y-2">
            <ColorInput
              label="主文字"
              value={themeColors.textPrimary}
              onChange={(value) => handleColorChange('textPrimary', value)}
              presetColors={['#111827', '#1f2937', '#374151', '#4b5563']}
            />
            <ColorInput
              label="次要文字"
              value={themeColors.textSecondary}
              onChange={(value) => handleColorChange('textSecondary', value)}
              presetColors={['#6b7280', '#9ca3af', '#d1d5db']}
            />
            <ColorInput
              label="辅助文字"
              value={themeColors.textTertiary}
              onChange={(value) => handleColorChange('textTertiary', value)}
              presetColors={['#9ca3af', '#d1d5db', '#e5e7eb']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeColorSettings;