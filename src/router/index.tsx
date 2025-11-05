import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ChannelAnalysisDetail from '../pages/ChannelAnalysisDetail';
import RegionAnalysisDetail from '../pages/RegionAnalysisDetail';
import ProductAnalysisDetail from '../pages/ProductAnalysisDetail';
import StoreRankingDetail from '../pages/StoreRankingDetail';
import AlertDetail from '../pages/AlertDetail';
import StoreDetail from '../pages/StoreDetail';
import ManagePage from '../pages/ManagePage';
import TakeoutPlatformDetail from '../pages/TakeoutPlatformDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },

  {
    path: '/takeout-platform-detail',
    element: <TakeoutPlatformDetail />
  },
  {
    path: '/takeout-platforms',
    element: <TakeoutPlatformDetail />
  },
  {
    path: '/region-analysis',
    element: <RegionAnalysisDetail />
  },
  {
    path: '/region-analysis/:regionName',
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
    path: '/store/:storeId',
    element: <StoreDetail />
  },
  {
    path: '/manage',
    element: <ManagePage />
  }
], {
  basename: '/mobile-dashboard'
});