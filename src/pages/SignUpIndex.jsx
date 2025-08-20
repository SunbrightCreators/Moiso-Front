import React, { useState } from 'react';
import useModeStore from '../stores/useModeStore';

import SignUpPage1 from './SignUpPage1';
import SignUpPage2 from './SignUpPage2';

const stepComponents = [
  SignUpPage1, // 인덱스 0
  SignUpPage2, // 인덱스 1
];

function SignUpIndex() {
  const [currentStep, setCurrentStep] = useState(0);
  const setIsProposerMode = useModeStore((state) => state.setIsProposerMode);

  const goToNextStep = (isProposer) => {
    // isProposer가 undefined가 아닌 경우에만 setIsProposerMode 호출
    if (typeof isProposer === 'boolean') {
      setIsProposerMode(isProposer);
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const renderStep = () => {
    // 배열에서 현재 단계에 해당하는 컴포넌트를 가져옵니다.
    const CurrentComponent = stepComponents[currentStep];
    if (CurrentComponent) {
      return <CurrentComponent onNextStep={goToNextStep} />;
    }

    // 만약 현재 단계가 배열 범위를 벗어나면 null을 반환
    return null;
  };
  return renderStep();
}

export default SignUpIndex;
