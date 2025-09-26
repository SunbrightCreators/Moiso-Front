// pages/ProposalIndex.jsx
import React, { useState } from 'react';
import ProposalCreatePage from './ProposalCreatePage';
import PlaceSearchPage from './PlaceSearchPage';
import CreateProposalMapPage from './CreateProposalMapPage';

export default function ProposalIndex() {
  // 현재 표시할 화면: 'create' | 'map' | 'search'
  const [currentView, setCurrentView] = useState('create');

  // 제안글 전체 데이터 (회원가입 패턴과 동일)
  const [proposalData, setProposalData] = useState({
    // 기본 제안글 정보
    title: '',
    content: '',
    category: '',

    // 위치 정보
    location: {
      address: {
        sido: '',
        sigungu: '',
        eupmyundong: '',
        jibun_detail: '',
        road_detail: '',
      },
      position: {
        latitude: null,
        longitude: null,
      },
      radius: 250,
    },

    // 기타 필요한 데이터들
    searchResult: null,
  });

  // 데이터 업데이트 함수 (회원가입 패턴과 동일)
  const updateProposalData = (payload) => {
    if (payload && typeof payload === 'object') {
      setProposalData((prev) => ({ ...prev, ...payload }));
    }
  };

  // 화면 전환 함수들
  const showCreateView = (payload) => {
    updateProposalData(payload);
    setCurrentView('create');
  };

  const showMapView = (payload) => {
    updateProposalData(payload);
    setCurrentView('map');
  };

  const showSearchView = (payload) => {
    updateProposalData(payload);
    setCurrentView('search');
  };

  // 조건부 렌더링
  if (currentView === 'create') {
    return (
      <ProposalCreatePage
        data={proposalData}
        onShowMapView={showMapView}
        onUpdateData={updateProposalData}
      />
    );
  }

  if (currentView === 'map') {
    return (
      <CreateProposalMapPage
        data={proposalData}
        onShowCreateView={showCreateView}
        onShowSearchView={showSearchView}
        onUpdateData={updateProposalData}
      />
    );
  }

  if (currentView === 'search') {
    return (
      <PlaceSearchPage
        data={proposalData}
        onShowMapView={showMapView}
        onUpdateData={updateProposalData}
      />
    );
  }

  return null;
}
