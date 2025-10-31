import React, { useEffect, useRef } from 'react';
import { MetricDefinition } from '../../data/metricDefinitions';

interface MetricDefinitionTooltipProps {
  visible: boolean;
  onClose: () => void;
  metric?: MetricDefinition;
  position?: { x: number; y: number };
}

const MetricDefinitionTooltip: React.FC<MetricDefinitionTooltipProps> = ({
  visible,
  onClose,
  metric,
  position = { x: 0, y: 0 }
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible || !metric) return null;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs"
      style={{
        left: position.x + 20,
        top: position.y - 10,
        maxWidth: '280px'
      }}
    >
      {/* 指标名称 */}
      <div className="font-semibold text-gray-900 text-sm mb-2 border-b border-gray-100 pb-1">
        {metric.name}
      </div>
      
      {/* 指标定义 */}
      <div className="mb-2">
        <div className="text-xs text-gray-500 mb-1">定义</div>
        <div className="text-xs text-gray-700 leading-relaxed">
          {metric.definition}
        </div>
      </div>
      
      {/* 计算算法 */}
      {metric.algorithm !== '/' && (
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">算法</div>
          <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border font-mono">
            {metric.algorithm.split('\n').map((line, index) => (
              <div key={index} className="mb-1 last:mb-0">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 分类 */}
      <div className="flex items-center justify-between">
        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
          {metric.category}
        </span>
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600 ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default MetricDefinitionTooltip;