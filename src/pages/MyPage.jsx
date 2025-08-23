import { Link, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../constants/route';
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import useModeStore from '../stores/useModeStore';
import useDialogStore from '../stores/useDialogStore';
import TopNavigation from '../components/common/TopNavigation';
import BottomNavigation from '../components/common/BottomNavigation';
import { Switch, Button, Progress, Avatar } from '@chakra-ui/react';
import ToProposer from '../assets/icons/ChangetoPr.svg';
import ToFounder from '../assets/icons/ChangetoFo.svg';
import Lv1 from '../assets/icons/lv1.svg';
import Lv2 from '../assets/icons/lv2.svg';
import Lv3 from '../assets/icons/lv3.svg';
import ScrapIcon from '../assets/icons/bookmark.svg';

import MyProposalIcon from '../assets/icons/BNB_proposal.svg';
import MyFundingIcon from '../assets/icons/BNB_funding.svg';
import ChevronRight from '../assets/icons/chevron-right.svg';

const MyPage = () => {
  const { isProposerMode, setIsProposerMode } = useModeStore();
  const { setConfirmDialog } = useDialogStore();
  const imgSrc = isProposerMode ? ToFounder : ToProposer;
  const navigate = useNavigate();

  useEffect(() => {
    const store = useModeStore.getState();
    const prev = store.isProposerMode; // 기존 값 저장
    store.setIsProposerMode(true); // 🔸제안자(지역주민) 모드로 강제

    // 페이지 벗어나면 원복
    return () => store.setIsProposerMode(prev);
  }, []);

  const SwitchClick = useCallback(
    (e) => {
      e.preventDefault(); // 스위치 토글 방지(디자인만)
      if (isProposerMode) {
        const hasFounder = !!user?.membership?.founder;
        if (hasFounder) {
          setIsProposerMode(false); // 바로 전환
          return;
        }
        setConfirmDialog({
          title: '창업자 회원가입이 필요합니다',
          content: '창업자 모드 이용을 위해 최초 1회 가입이 필요해요.',
          actionText: '회원가입',
          showCancelButton: true,
          onAction: () => {
            navigate(ROUTE_PATH.SIGNUP_FOUNDER);
            /* TODO: 가입 플로우 진입 후 전환 */
          },
        });
      } else {
        const hasProposer = !!user?.membership?.proposer;
        if (hasProposer) {
          setIsProposerMode(true); // 바로 전환
          return;
        }
        setConfirmDialog({
          title: '지역주민 회원가입이 필요합니다',
          content: '지역주민 모드 이용을 위해 최초 1회 가입이 필요해요.',
          actionText: '회원가입',
          showCancelButton: true,
          onAction: () => {
            navigate(ROUTE_PATH.SIGNUP_PROPOSER);
            /* TODO: 가입 플로우 진입 후 전환 */
          },
        });
      }
    },
    [isProposerMode, setConfirmDialog],
  );

  /** 목데이터 */
  const MOCK_USER = {
    id: 'u_001',
    name: '김이화',
    email: 'ewha123@gmail.com',
    avatarUrl: 'https://bit.ly/sage-adebayo', // 있으면 교체
    membership: {
      proposer: true, // 지역주민 프로필 보유 여부
      founder: false, // 창업자 프로필 보유 여부
    },
    level: {
      district: '대현동',
      current: 1, // 1|2|3 ...
      next: 2,
      progressPercent: 35, // 0~100
      remainingPoints: 15,
    },
  };

  const LEVEL_ICON = {
    1: Lv1,
    2: Lv2,
    3: Lv3,
  };

  const user = MOCK_USER;
  const level = user.level;

  const levelIconSrc = level ? LEVEL_ICON[level.current] : undefined;

  return (
    <PageWrapper>
      <TopNavigation title='마이페이지' />

      <Scontent>
        <ModChangeSection>
          <Left>
            <BadgeImg src={imgSrc} />
          </Left>
          <Right>
            <Switch.Root colorPalette='yellow' onClick={SwitchClick}>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
          </Right>
        </ModChangeSection>

        <AccountSection>
          <AccountCard>
            <AccountLeft>
              <Avatar.Root shape='full' size='xl'>
                <Avatar.Fallback name={user.name} />
                <Avatar.Image src={user.avatarUrl} />
              </Avatar.Root>
              <Info>
                <Name>{user.name}</Name>
                <Email>{user.email}</Email>
              </Info>
            </AccountLeft>
            <Button
              size='2xs_rounded'
              borderRadius='2rem'
              variant='surface'
              px='12px'
              height='var(--sizes-6, 1.5rem)'
              gap=' var(--spacing-1, 0.25rem)'
              font='var(--text-xs-medium)'
            >
              계정설정
            </Button>
          </AccountCard>

          {isProposerMode && (
            <LevelCard>
              <LevelHead>
                <LevelIcon src={levelIconSrc} alt={`LV.${level.current}`} />
                <LevelTitle>
                  현재 {level.district} LV. {level.current}에 있어요!
                </LevelTitle>
              </LevelHead>

              <Progress.Root
                colorPalette='yellow'
                variant='outline'
                shape='rounded'
                size='xs'
              >
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>

              <LevelSub>
                LV. {level.next}까지 {level.remainingPoints}점 남았어요!
              </LevelSub>
            </LevelCard>
          )}
        </AccountSection>

        <MenuSection>
          {isProposerMode ? (
            <>
              <SRow>
                <SIconWrap>
                  <img src={ScrapIcon} alt='' />
                </SIconWrap>
                <SLabel>스크랩</SLabel>
                <SChevronLink
                  to={ROUTE_PATH.MY_SCRAP}
                  aria-label='스크랩으로 이동'
                >
                  <img src={ChevronRight} alt='' />
                </SChevronLink>
              </SRow>

              <SRow>
                <SIconWrap>
                  <img src={MyProposalIcon} alt='' />
                </SIconWrap>
                <SLabel>내가 작성한 제안글</SLabel>
                <SChevronLink
                  to={ROUTE_PATH.MY_PROPOSAL}
                  aria-label='내가 작성한 제안글로 이동'
                >
                  <img src={ChevronRight} alt='' />
                </SChevronLink>
              </SRow>

              <SRow $last>
                <SIconWrap>
                  <img src={MyFundingIcon} alt='' />
                </SIconWrap>
                <SLabel>내가 후원한 펀딩 프로젝트</SLabel>
                <SChevronLink
                  to={ROUTE_PATH.MY_FUNDING}
                  aria-label='내가 후원한 펀딩 프로젝트로 이동'
                >
                  <img src={ChevronRight} alt='' />
                </SChevronLink>
              </SRow>
            </>
          ) : (
            <>
              <SRow>
                <SIconWrap>
                  <img src={ScrapIcon} alt='' />
                </SIconWrap>
                <SLabel>스크랩</SLabel>
                <SChevronLink
                  to={ROUTE_PATH.MY_SCRAP}
                  aria-label='스크랩으로 이동'
                >
                  <img src={ChevronRight} alt='' />
                </SChevronLink>
              </SRow>

              <SRow $last>
                <SIconWrap>
                  <img src={MyFundingIcon} alt='' />
                </SIconWrap>
                <SLabel>나의 펀딩 프로젝트</SLabel>
                <SChevronLink
                  to={ROUTE_PATH.MY_FUNDING}
                  aria-label='나의 펀딩 프로젝트로 이동'
                >
                  <img src={ChevronRight} alt='' />
                </SChevronLink>
              </SRow>
            </>
          )}
        </MenuSection>
      </Scontent>

      <Bottom>
        <BottomNavigation />
      </Bottom>
    </PageWrapper>
  );
};

export default MyPage;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const Scontent = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
`;

const Bottom = styled.div`
  position: sticky;
  bottom: 0;
`;

/* 모드변환부분 */

const ModChangeSection = styled.div`
  display: flex;
  height: 2.75rem;
  padding: 0.75rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 11.5625rem;
  flex-shrink: 0;
  background: #27272a;
`;
const BadgeImg = styled.img`
  width: 8.3125rem;
  height: 1rem;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  min-height: 24px;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

/* 계정설정 부분 */
const AccountSection = styled.section`
  display: flex;
  padding: 1.25rem 1rem;
  flex-direction: column;
  gap: 0.625rem;
  background: var(--colors-bg-subtle, #fafafa);
`;

const AccountCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AccountLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Name = styled.div`
  font-weight: 700;
`;

const Email = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

/* 계정설정 - 지역주민 추가부분 */

const LevelCard = styled.section`
  margin-top: 10px;
  background: #fff;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LevelHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LevelIcon = styled.img`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const LevelTitle = styled.div`
  gap: 2rem;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.2;
`;

const LevelSub = styled.div`
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.2;
`;

/**목록 섹션  */
const MenuSection = styled.section`
  margin-top: 12px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
`;

const SRow = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 12px;
  border-bottom: ${({ $last }) => ($last ? '0' : '1px solid #f3f4f6')};
`;

const SIconWrap = styled.span`
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  margin-right: 10px;
  img {
    width: 20px;
    height: 20px;
    display: block;
  }
`;

const SLabel = styled.span`
  flex: 1;
  font-size: 14px;
  color: #27272a;
`;

const SChevronLink = styled(Link)`
  display: grid;
  place-items: center;
  padding: 4px;
  text-decoration: none;
  img {
    width: 16px;
    height: 16px;
    display: block;
  }
`;
