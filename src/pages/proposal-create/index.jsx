import { useState, useMemo, lazy } from 'react';

const ProposalCreatePage = lazy(() => import('./ProposalCreatePage'));
const PlaceSearchPage = lazy(() => import('./PlaceSearchPage'));

export default function ProposalIndex() {
  // 0: 생성(추천) 화면, 1: 장소검색 화면
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({ location: '' }); // 스텝 간 공유 데이터

  const steps = useMemo(() => [ProposalCreatePage, PlaceSearchPage], []);
  const Current = steps[currentStep];

  const merge = (payload) => {
    if (payload && typeof payload === 'object') {
      setData((p) => ({ ...p, ...payload }));
    }
  };

  const onNextStep = (payload) => {
    merge(payload);
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onPrevStep = (payload) => {
    merge(payload);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  return (
    <Current data={data} onNextStep={onNextStep} onPrevStep={onPrevStep} />
  );
}
