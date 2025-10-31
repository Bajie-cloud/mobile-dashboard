import React from 'react';
import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const RegionAnalysisDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar 
        onBack={() => navigate(-1)}
        className="bg-white shadow-sm"
      >
        区域分析详情
      </NavBar>
      <div className="p-4">
        <div className="text-center text-gray-500 mt-20">
          区域分析详情页面开发中...
        </div>
      </div>
    </div>
  );
};

export default RegionAnalysisDetail;