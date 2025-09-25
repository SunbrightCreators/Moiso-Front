import React, { useMemo, useState } from 'react';
import useModeStore from '../../stores/useModeStore';
import { usePostAccount } from '../../apis/accounts';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../constants/route';

import SignUpPage1 from './SignUpPage1';
import SignUpPage2 from './SignUpPage2';
import OnBoardingSelect from './OnBardingSelect';
import NeighborhoodSettingsPage from './NeighborhoodSettingsPage';
import FounderTarget from '../signup-founder/FounderTarget';
import FounderTime from '../signup-founder/FounderTime';
import WelcomePage from './WelcomePage';

function SignUpIndex() {
  const navigate = useNavigate();
  const { isProposerMode } = useModeStore(); // true=제안자, false=창업자
  const [currentStep, setCurrentStep] = useState(0);
  const [signupData, setSignupData] = useState({});

  const { mutate: postAccount, isPending, isError, error } = usePostAccount();

  const steps = useMemo(
    () =>
      isProposerMode
        ? [
            SignUpPage1,
            SignUpPage2,
            OnBoardingSelect,
            NeighborhoodSettingsPage,
            WelcomePage,
          ]
        : [
            SignUpPage1,
            SignUpPage2,
            OnBoardingSelect,
            NeighborhoodSettingsPage,
            FounderTarget,
            FounderTime,
            WelcomePage,
          ],
    [isProposerMode],
  );

  const isLast = currentStep === steps.length - 1;

  const goToNextStep = (payload) => {
    if (payload && typeof payload === 'object') {
      setSignupData((prev) => ({ ...prev, ...payload })); //기존 값 유지 + 새로운 값 덮어쓰기
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const buildPayload = () => {
    const {
      email,
      password,
      name,
      birth,
      sex,
      is_marketing_allowed,
      industryList,
      addressList,
      targetList,
      business_hours,
    } = signupData;

    return {
      email,
      password,
      name,
      birth,
      sex,
      is_marketing_allowed: !!is_marketing_allowed,
      industryList: industryList ?? [],
      addressList: addressList ?? [],
      targetList: targetList ?? null, // null이면 제안자
      business_hours: business_hours ?? null, // null이면 제안자
    };
  };

  const handleSubmit = () => {
    if (isPending) return; // 중복 클릭 방지
    const payload = buildPayload();

    postAccount(payload, {
      onSuccess: () => {
        navigate(ROUTE_PATH.PROPOSAL);
      },
      onError: () => {},
    });
  };

  const Current = steps[currentStep];

  return (
    <Current
      onNextStep={goToNextStep}
      data={signupData}
      onSubmit={isLast ? handleSubmit : undefined}
      isSubmitting={isPending}
      submitError={
        isError ? error?.message || '회원가입에 실패했습니다.' : null
      }
      isLastStep={isLast}
    />
  );
}

export default SignUpIndex;
