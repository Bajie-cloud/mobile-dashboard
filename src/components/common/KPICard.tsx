import React from 'react';
import { Card } from 'antd-mobile';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatChangeRate, getChangeColorClass, isPositiveChange } from '../../utils/format';

interface KPICardProps {
  title: string;
  value: number;
  changeRate?: number;
  changeValue?: number;
  unit?: string;
  loading?: boolean;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  changeRate,
  changeValue,
  unit = '',
  loading = false,
  onClick
}) => {
  const hasChange = changeRate !== undefined;
  const isPositive = hasChange ? isPositiveChange(changeRate) : false;
  const changeColorClass = hasChange ? getChangeColorClass(changeRate) : '';

  return (
    <Card 
      className="mb-4 cursor-pointer touch-feedback card-shadow hover:card-shadow-hover"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2 font-medium">{title}</div>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {typeof value === 'number' && value >= 10000 ? formatCurrency(value) : value.toString()}
              {unit && <span className="text-sm text-gray-500 ml-1 font-normal">{unit}</span>}
            </div>
            
            {hasChange && (
              <div className={`flex items-center text-sm px-2 py-1 rounded-md ${changeColorClass}`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 flex-shrink-0" />
                )}
                <span className="font-medium">
                  较上期 {formatChangeRate(changeRate)}
                  {changeValue !== undefined && (
                    <span className="ml-1 font-normal">
                      ({isPositive ? '+' : ''}{changeValue > 10000 ? formatCurrency(changeValue) : changeValue.toString()})
                    </span>
                  )}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};