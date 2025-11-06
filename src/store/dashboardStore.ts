import { create } from 'zustand';
import { 
  CorePerformance, 
  ChannelAnalysis, 
  RegionAnalysis, 
  ProductSales, 
  StoreRanking, 
  AlertRecord 
} from '../types';
import { DataService } from '../services/dataService';

interface SectionSetting {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface ThemeColors {
  // 主色调
  primary: string;
  // 辅助色
  secondary1: string;
  secondary2: string;
  secondary3: string;
  // 功能色
  success: string;
  warning: string;
  danger: string;
  // 背景色
  cardBackground: string;
  pageBackground: string;
  // 文字色
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  // 渐变色
  gradientRevenue: string;
  gradientTraffic: string;
  gradientHighlight: string;
  // 图表色
  chartColors: string[];
}

interface DashboardState {
  // 数据状态
  corePerformance: CorePerformance | null;
  channelAnalysis: ChannelAnalysis | null;
  regionAnalysis: RegionAnalysis | null;
  productSales: ProductSales | null;
  storeRanking: StoreRanking | null;
  alertRecords: AlertRecord[];
  
  // 加载状态
  loading: {
    corePerformance: boolean;
    channelAnalysis: boolean;
    regionAnalysis: boolean;
    productSales: boolean;
    storeRanking: boolean;
    alertRecords: boolean;
  };
  
  // 当前选择的日期
  selectedDate: string;
  
  // 页面指标管理
  sectionSettings: SectionSetting[];
  
  // 主题颜色
  themeColors: ThemeColors;
  
  // 操作方法
  setSelectedDate: (date: string) => void;
  loadCorePerformance: () => Promise<void>;
  loadChannelAnalysis: () => Promise<void>;
  loadRegionAnalysis: () => Promise<void>;
  loadProductSales: () => Promise<void>;
  loadStoreRanking: () => Promise<void>;
  loadAlertRecords: () => Promise<void>;
  loadAllData: () => Promise<void>;
  updateSectionSettings: (sectionId: string, updates: Partial<SectionSetting>) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  updateThemeColors: (colors: Partial<ThemeColors>) => void;
  resetThemeColors: () => void;
}

// 默认主题颜色
const defaultThemeColors: ThemeColors = {
  // 主色调
  primary: '#3b82f6',
  // 辅助色
  secondary1: '#f59e0b',
  secondary2: '#10b981',
  secondary3: '#8b5cf6',
  // 功能色
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  // 背景色
  cardBackground: '#ffffff',
  pageBackground: '#f9fafb',
  // 文字色
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  // 渐变色
  gradientRevenue: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
  gradientTraffic: 'linear-gradient(135deg, #9A7B0A 0%, #C49A0A 100%)',
  gradientHighlight: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
  // 图表色
  chartColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // 初始数据状态
  corePerformance: null,
  channelAnalysis: null,
  regionAnalysis: null,
  productSales: null,
  storeRanking: null,
  alertRecords: [],
  
  // 初始加载状态
  loading: {
    corePerformance: false,
    channelAnalysis: false,
    regionAnalysis: false,
    productSales: false,
    storeRanking: false,
    alertRecords: false,
  },
  
  // 默认日期为今天
  selectedDate: new Date().toISOString().split('T')[0],
  
  // 页面指标管理设置
  sectionSettings: [
    { id: 'corePerformance', name: '核心业绩', enabled: true, order: 0 },
    { id: 'channelAnalysis', name: '渠道分析', enabled: true, order: 1 },
    { id: 'regionAnalysis', name: '区域分析', enabled: true, order: 2 },
    { id: 'productAnalysis', name: '菜品分析', enabled: true, order: 3 },
    { id: 'storeRanking', name: '门店排行', enabled: true, order: 4 },
    { id: 'alertSection', name: '异常预警', enabled: true, order: 5 },
  ],
  
  // 主题颜色
  themeColors: defaultThemeColors,
  
  // 设置选择的日期
  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    // 日期变化时重新加载相关数据
    get().loadCorePerformance();
    get().loadChannelAnalysis();
  },
  
  // 加载核心业绩数据
  loadCorePerformance: async () => {
    set(state => ({
      loading: { ...state.loading, corePerformance: true }
    }));
    
    try {
      const data = await DataService.getCorePerformance();
      set({ corePerformance: data });
    } catch (error) {
      console.error('Failed to load core performance data:', error);
    } finally {
      set(state => ({
        loading: { ...state.loading, corePerformance: false }
      }));
    }
  },
  
  // 加载渠道分析数据
  loadChannelAnalysis: async () => {
    set(state => ({
      loading: { ...state.loading, channelAnalysis: true }
    }));
    
    try {
      const data = await DataService.getChannelAnalysis();
      set({ channelAnalysis: data });
    } catch (error) {
      console.error('Failed to load channel analysis data:', error);
    } finally {
      set(state => ({
        loading: { ...state.loading, channelAnalysis: false }
      }));
    }
  },
  
  // 加载区域分析数据
  loadRegionAnalysis: async () => {
    set(state => ({
      loading: { ...state.loading, regionAnalysis: true }
    }));
    
    try {
      const data = await DataService.getRegionAnalysis();
      set({ regionAnalysis: data });
    } catch (error) {
      console.error('Failed to load region analysis data:', error);
    } finally {
      set(state => ({
        loading: { ...state.loading, regionAnalysis: false }
      }));
    }
  },
  
  // 加载菜品销售数据
  loadProductSales: async () => {
    set(state => ({
      loading: { ...state.loading, productSales: true }
    }));
    
    try {
      const data = await DataService.getProductSales();
      set({ productSales: data });
    } catch (error) {
      console.error('Failed to load product sales data:', error);
    } finally {
      set(state => ({
        loading: { ...state.loading, productSales: false }
      }));
    }
  },
  
  // 加载门店排名数据
  loadStoreRanking: async () => {
    set(state => ({
      loading: { ...state.loading, storeRanking: true }
    }));
    
    try {
      const data = await DataService.getStoreRanking();
      set({ storeRanking: data });
    } catch (error) {
      console.error('Failed to load store ranking data:', error);
    } finally {
      set(state => ({
        loading: { ...state.loading, storeRanking: false }
      }));
    }
  },
  
  // 加载异常预警数据
  loadAlertRecords: async () => {
    set(state => ({
      loading: { ...state.loading, alertRecords: true }
    }));
    
    try {
      const data = await DataService.getAlertRecords();
      set({ alertRecords: data });
    } catch (error) {
      console.error('Failed to load alert records data:', error);
    } finally {
      set(state => ({
        loading: { ...state.loading, alertRecords: false }
      }));
    }
  },
  
  // 加载所有数据
  loadAllData: async () => {
    const { 
      loadCorePerformance, 
      loadChannelAnalysis, 
      loadRegionAnalysis, 
      loadProductSales, 
      loadStoreRanking, 
      loadAlertRecords 
    } = get();
    
    await Promise.all([
      loadCorePerformance(),
      loadChannelAnalysis(),
      loadRegionAnalysis(),
      loadProductSales(),
      loadStoreRanking(),
      loadAlertRecords()
    ]);
  },
  
  // 更新指标设置
  updateSectionSettings: (sectionId: string, updates: Partial<SectionSetting>) => {
    set((state) => ({
      sectionSettings: state.sectionSettings.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  },
  
  // 重新排序指标
  reorderSections: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const newSections = [...state.sectionSettings];
      const [movedSection] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedSection);
      
      // 更新order字段
      return {
        sectionSettings: newSections.map((section, index) => ({
          ...section,
          order: index
        }))
      };
    });
  },
  
  // 更新主题颜色
  updateThemeColors: (colors: Partial<ThemeColors>) => {
    set((state) => ({
      themeColors: { ...state.themeColors, ...colors }
    }));
  },
  
  // 重置主题颜色
  resetThemeColors: () => {
    set({ themeColors: defaultThemeColors });
  },
}));