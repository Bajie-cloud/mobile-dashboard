// 格式化数字为千分位
export const formatNumber = (num: number): string => {
  return num.toString();
};

// 格式化金额
export const formatCurrency = (amount: number): string => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}万`;
  }
  return `${amount.toString()}`;
};

// 格式化百分比
export const formatPercentage = (rate: number, decimals: number = 1): string => {
  return `${rate.toFixed(decimals)}%`;
};

// 格式化同比数据
export const formatChangeRate = (rate: number, showSign: boolean = true): string => {
  const sign = showSign && rate > 0 ? '+' : '';
  return `${sign}${rate.toFixed(1)}%`;
};

// 格式化同比变化值
export const formatChangeValue = (value: number, showSign: boolean = true): string => {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${formatNumber(value)}`;
};

// 判断数值是否为正增长
export const isPositiveChange = (value: number): boolean => {
  return value > 0;
};

// 获取同比变化的颜色类名
export const getChangeColorClass = (value: number): string => {
  if (value > 0) {
    return 'text-success-600';
  } else if (value < 0) {
    return 'text-danger-600';
  }
  return 'text-gray-600';
};

// 获取同比变化的背景色类名
export const getChangeBgColorClass = (value: number): string => {
  if (value > 0) {
    return 'bg-success-50';
  } else if (value < 0) {
    return 'bg-danger-50';
  }
  return 'bg-gray-50';
};

// 格式化日期
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 格式化时间
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 获取今日日期字符串
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 获取昨日日期字符串
export const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};