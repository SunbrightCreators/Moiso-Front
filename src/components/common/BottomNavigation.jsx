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

const BottomNavigation = () => {
  const { userMode: mode } = useModeStore();
  const location = useLocation();
  const currentPath = location.pathname;

  if (!mode) return null;
  const navItems = mode === 'founder' ? founderNavItems : residentNavItems;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%', // 1. 왼쪽 끝을 화면 중앙으로
        transform: 'translateX(-50%)', // 2. 자신의 너비 절반만큼 왼쪽으로 이동
        width: '390px', // 3. Figma 시안에 명시된 고정 너비
        maxWidth: '100%',
        backgroundColor: 'white',
        borderTop: '0.5px solid #E4E4E7',
        display: 'flex',
        padding: '8px 4px',
      }}
    >
      {navItems.map((item) => {
        const isActive = currentPath.startsWith(item.path);
        const { Icon, label, path } = item;

        return (
          <Link
            key={path}
            to={path}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              textDecoration: 'none',
              color: isActive ? '#27272A' : '#D4D4D8',
            }}
          >
            <Icon />
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: isActive ? '600' : '500',
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
