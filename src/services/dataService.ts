import { 
  CorePerformance, 
  ChannelAnalysis, 
  RegionAnalysis, 
  ProductSales, 
  StoreRanking, 
  AlertRecord 
} from '../types';

// Import JSON data
import corePerformanceData from '../data/corePerformance.json';
import channelAnalysisData from '../data/channelAnalysis.json';
import regionAnalysisData from '../data/regionAnalysis.json';
import productSalesData from '../data/productSales.json';
import storeRankingData from '../data/storeRanking.json';
import alertRecordsData from '../data/alertRecords.json';

export class DataService {
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async getCorePerformance(): Promise<CorePerformance> {
    await this.delay(500);
    const rawData = corePerformanceData[0];
    return {
      date: rawData.date,
      activeStores: {
        value: rawData.activeStores,
        changeRate: rawData.activeStoresChange,
        changeValue: rawData.activeStoresChange,
        isPositive: rawData.activeStoresChange >= 0
      },
      totalRevenue: {
        value: rawData.totalRevenue,
        changeRate: rawData.totalRevenueChangeRate,
        changeValue: rawData.totalRevenue * (rawData.totalRevenueChangeRate / 100),
        isPositive: rawData.totalRevenueChangeRate >= 0
      },
      avgStoreRevenue: {
        value: rawData.avgStoreRevenue,
        changeRate: rawData.avgStoreRevenueChangeRate,
        changeValue: rawData.avgStoreRevenue * (rawData.avgStoreRevenueChangeRate / 100),
        isPositive: rawData.avgStoreRevenueChangeRate >= 0
      }
    };
  }

  static async getChannelAnalysis(): Promise<ChannelAnalysis> {
    await this.delay(500);
    return channelAnalysisData[0];
  }

  static async getRegionAnalysis(): Promise<RegionAnalysis> {
    await this.delay(500);
    return regionAnalysisData[0];
  }

  static async getProductSales(): Promise<ProductSales> {
    await this.delay(500);
    return productSalesData[0];
  }

  static async getStoreRanking(): Promise<StoreRanking> {
    await this.delay(500);
    return storeRankingData[0];
  }

  static async getAlertRecords(): Promise<AlertRecord[]> {
    await this.delay(500);
    return alertRecordsData[0].alerts;
  }

  static async getStoreInfo(storeId: string) {
    await this.delay(300);
    // Find store in ranking data
    const storeData = storeRankingData[0].topStores.find(store => store.id === storeId);
    return storeData || null;
  }
}