import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import CorePerformanceDetail from '../pages/CorePerformanceDetail';
import ChannelAnalysisDetail from '../pages/ChannelAnalysisDetail';
import RegionAnalysisDetail from '../pages/RegionAnalysisDetail';
import ProductAnalysisDetail from '../pages/ProductAnalysisDetail';
import StoreRankingDetail from '../pages/StoreRankingDetail';
import AlertDetail from '../pages/AlertDetail';
import StoreDetail from '../pages/StoreDetail';
import ManagePage from '../pages/ManagePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/core-performance',
    element: <CorePerformanceDetail />
  },
  {
    path: '/channel-analysis',
    element: <ChannelAnalysisDetail />
  },
  {
    path: '/region-analysis',
    element: <RegionAnalysisDetail />
  },
  {
    path: '/product-analysis',
    element: <ProductAnalysisDetail />
  },
  {
    path: '/store-ranking',
    element: <StoreRankingDetail />
  },
  {
    path: '/alert',
    element: <AlertDetail />
  },
  {
    path: '/store/:storeId',
    element: <StoreDetail />
  },
  {
    path: '/manage',
    element: <ManagePage />
  }
]);