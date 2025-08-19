import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useModeStore from '../../stores/useModeStore';
import styled from 'styled-components';

import { ReactComponent as ProposalIcon } from '../../assets/icons/BNB_proposal.svg';
import { ReactComponent as FundingIcon } from '../../assets/icons/BNB_funding.svg';
import { ReactComponent as RewardIcon } from '../../assets/icons/BNB_reward.svg';
import { ReactComponent as MyIcon } from '../../assets/icons/BNB_my.svg';
import { ReactComponent as RecommendIcon } from '../../assets/icons/BNB_rec.svg';

const proposerNavItems = [
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
const SNavigationContainer = styled.nav`
  width: 100%;
  background-color: white;
  border-top: 0.5px solid #e4e4e7;
  display: flex;
  padding: 8px 4px;
`;
const SLink = styled(Link)`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  textdecoration: none;
  color: ${({ isActive }) =>
    isActive
      ? 'var(--colors-text-default, #27272A)'
      : 'var(--colors-text-subtle2, #D4D4D8)'};
`;
const SLabel = styled.span`
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: ${({ isActive }) => (isActive ? '600' : '500')};
`;

const BottomNavigation = () => {
  const { isProposerMode } = useModeStore();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = isProposerMode ? proposerNavItems : founderNavItems;

  return (
    <SNavigationContainer>
      {navItems.map((item) => {
        const isActive = currentPath.startsWith(item.path);
        const { Icon, label, path } = item;

        return (
          <SLink key={path} to={path} isActive={isActive}>
            <Icon />
            <SLabel isActive={isActive}>{label}</SLabel>
          </SLink>
        );
      })}
    </SNavigationContainer>
  );
};

export default BottomNavigation;
