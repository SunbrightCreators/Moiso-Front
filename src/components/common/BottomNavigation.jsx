import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useModeStore from '../../stores/useModeStore';

import { ReactComponent as ProposalIcon } from '../../assets/icons/BNB_proposal.svg';
import { ReactComponent as FundingIcon } from '../../assets/icons/BNB_funding.svg';
import { ReactComponent as RewardIcon } from '../../assets/icons/BNB_reward.svg';
import { ReactComponent as MyIcon } from '../../assets/icons/BNB_my.svg';
import { ReactComponent as RecommendIcon } from '../../assets/icons/BNB_rec.svg';

const residentNavItems = [
  { path: '/proposal', label: '제안', Icon: ProposalIcon },
  { path: '/funding', label: '펀딩', Icon: FundingIcon },
  { path: '/reward', label: '리워드', Icon: RewardIcon },
  { path: '/my', label: '마이', Icon: MyIcon },
];

const founderNavItems = [
  { path: '/proposal', label: '제안', Icon: ProposalIcon },
  { path: '/recommend', label: '추천', Icon: RecommendIcon },
  { path: '/funding', label: '펀딩', Icon: FundingIcon },
  { path: '/my', label: '마이', Icon: MyIcon },
];
