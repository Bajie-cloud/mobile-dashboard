import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
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
    path: '/channel-analysis',
    element: <ChannelAnalysisDetail />
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
], {
  basename: '/mobile-dashboard'
});