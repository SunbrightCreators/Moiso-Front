// src/pages/mypage/MyPage.jsx
import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Avatar, Button, Switch } from '@chakra-ui/react';
import {
  TopNavigation,
  BottomNavigation,
} from '../../components/common/navigation';
import { ROUTE_PATH } from '../../constants/route';
import useDialogStore from '../../stores/useDialogStore';
import useModeStore from '../../stores/useModeStore';
import { useGetProfile, useGetProfileList } from '../../apis/accounts'; // ✅ API 연동
import ToFounder from '../../assets/icons/change_to_founder.svg';
import ToProposer from '../../assets/icons/change_to_proposer.svg';
import ChevronRight from '../../assets/icons/chevron_right.svg';
import Lv1 from '../../assets/icons/lv1.svg';
import Lv2 from '../../assets/icons/lv2.svg';
import Lv3 from '../../assets/icons/lv3.svg';
import MyFundingIcon from '../../assets/icons/funding.svg';
import MyProposalIcon from '../../assets/icons/proposal.svg';
import ScrapIcon from '../../assets/icons/scrap_default.svg';

// 제안자 프로필에서 레벨 (가장 높은 레벨 선택)
const pickProposerLevel = (d) => {
  const pp =
    d?.proposer_profile ??
    d?.profile?.proposer_profile ?? // 혹시 profile 아래로 내려오는 경우 대비
    null;

  const arr = Array.isArray(pp?.proposer_level) ? pp.proposer_level : [];
  if (!arr.length) return null;

  // 레벨 가장 높은 항목을 대표로 선택
  const best = arr.reduce(
    (a, b) => (Number(b?.level || 0) > Number(a?.level || 0) ? b : a),
    arr[0],
  );
  const addr =
    Array.isArray(best?.address) && best.address[0] ? best.address[0] : {};

  return {
    current: Number(best?.level) || 0,
    district: addr.eupmyundong || addr.sigungu || addr.sido || '',
  };
};

// 프로필 응답
const normalizeProfileList = (raw) => {
  const d = raw?.data ?? raw;

  // 1) ["proposer","founder"]
  if (Array.isArray(d)) return d.map((x) => String(x).toLowerCase());

  if (Array.isArray(d?.profile)) {
    return d.profile.map((x) => String(x).toLowerCase());
  }
  if (Array.isArray(d?.profiles)) {
    return d.profiles.map((x) => String(x).toLowerCase());
  }

  const out = [];
  if (d?.profiles && typeof d.profiles === 'object') {
    Object.entries(d.profiles).forEach(
      ([k, v]) => v && out.push(String(k).toLowerCase()),
    );
  }
  if (d?.proposer) out.push('proposer');
  if (d?.founder) out.push('founder');

  return out;
};

const LEVEL_ICON = { 1: Lv1, 2: Lv2, 3: Lv3 };

const MyPage = () => {
  const { isProposerMode, setIsProposerMode } = useModeStore();
  const { setConfirmDialog } = useDialogStore();
  const navigate = useNavigate();

  // 1) 현재 사용자가 보유한 프로필 목록 조회
  const {
    data: profileListRes,
    isLoading: isProfileListLoading,
    isError: isProfileListError,
  } = useGetProfileList();

  const profileList = useMemo(
    () => normalizeProfileList(profileListRes),
    [profileListRes],
  );

  const hasProposer = profileList.some(
    (v) =>
      String(v).toLowerCase().includes('proposer') ||
      String(v).toLowerCase().includes('resident'),
  );
  const hasFounder = profileList.some((v) =>
    String(v).toLowerCase().includes('founder'),
  );

  // 2) 현재 모드에 맞춰 필요한 필드만 쿼리 파라미터로 요청
  const proposerFields = [
    'name',
    'email',
    'address',
    'profile_image',
    'level', // proposer 전용
  ];
  const founderFields = ['name', 'email', 'address', 'profile_image'];

  const activeProfile = isProposerMode ? 'proposer' : 'founder';
  const fieldList = isProposerMode ? proposerFields : founderFields;

  const {
    data: profileRes,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfile(activeProfile, fieldList);

  // 3) 화면용 user 모델 매핑 (숫자/객체 스키마 모두 대응)
  const user = useMemo(() => {
    const d = profileRes?.data ?? profileRes;
    if (!d) return null;
    const level = isProposerMode ? pickProposerLevel(d) : null;
    return {
      name: d.name ?? '',
      email: d.email ?? '',
      avatarUrl: d.profile_image ?? '',
      level,
    };
  }, [profileRes, isProposerMode]);

  const imgSrc = isProposerMode ? ToFounder : ToProposer;

  // 4) 모드 스위치 클릭 로직 (실제 보유 프로필 기준)
  const SwitchClick = useCallback(
    (e) => {
      e.preventDefault(); // 스위치 자체 토글 방지(디자인만)

      if (isProposerMode) {
        // 현재 제안자 모드 → 창업자 모드로 전환
        if (hasFounder) {
          setIsProposerMode(false);
          return;
        }
        setConfirmDialog({
          title: '창업자 회원가입이 필요합니다',
          content: '창업자 모드 이용을 위해 최초 1회 가입이 필요해요.',
          actionText: '회원가입',
          showCancelButton: true,
          onAction: () => navigate(ROUTE_PATH.SIGNUP),
        });
      } else {
        // 현재 창업자 모드 → 제안자 모드로 전환
        if (hasProposer) {
          setIsProposerMode(true);
          return;
        }
        setConfirmDialog({
          title: '지역주민 회원가입이 필요합니다',
          content: '지역주민 모드 이용을 위해 최초 1회 가입이 필요해요.',
          actionText: '회원가입',
          showCancelButton: true,
          onAction: () => navigate(ROUTE_PATH.SIGNUP),
        });
      }
    },
    [
      isProposerMode,
      hasFounder,
      hasProposer,
      navigate,
      setConfirmDialog,
      setIsProposerMode,
    ],
  );

  const levelIconSrc =
    isProposerMode && user?.level?.current
      ? LEVEL_ICON[user.level.current]
      : undefined;

  // 5) 로딩/에러 처리(짧게)
  if (isProfileListLoading || isProfileLoading) {
    return (
      <PageWrapper>
        <TopNavigation title='마이페이지' />
        <Scontent style={{ padding: 16 }}>불러오는 중…</Scontent>
        <BottomNavigation />
      </PageWrapper>
    );
  }
  if (isProfileListError || isProfileError) {
    return (
      <PageWrapper>
        <TopNavigation title='마이페이지' />
        <Scontent style={{ padding: 16 }}>
          정보를 불러오지 못했습니다. 다시 시도해 주세요.
        </Scontent>
        <BottomNavigation />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <TopNavigation title='마이페이지' />

      <Scontent>
        {/* 모드 전환 영역 */}
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

        {/* 계정 영역 */}
        <AccountSection>
          <AccountCard>
            <AccountLeft>
              <Avatar.Root shape='full' size='xl'>
                <Avatar.Fallback name={user?.name ?? ''} />
                <Avatar.Image src={user?.avatarUrl} />
              </Avatar.Root>
              <Info>
                <Name>{user?.name}</Name>
                <Email>{user?.email}</Email>
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
              onClick={() => navigate(ROUTE_PATH.LEVEL)}
            >
              계정설정
            </Button>
          </AccountCard>

          {/* 제안자 모드일 때 레벨 카드/동네인증 항상 노출 (값은 가드 처리) */}
          {isProposerMode && (
            <LevelCard>
              <LevelHead>
                {levelIconSrc && (
                  <LevelIcon
                    src={levelIconSrc}
                    alt={`LV.${user?.level?.current ?? '-'}`}
                  />
                )}
                <LevelTitle>
                  {user?.level?.district
                    ? `현재 ${user.level.district} `
                    : '현재 '}
                  LV. {user?.level?.current ?? ''}에 있어요!
                </LevelTitle>
              </LevelHead>
              <VisitVerifyButton>우리 동네 방문 인증</VisitVerifyButton>
            </LevelCard>
          )}
        </AccountSection>

        {/* 메뉴 */}
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

      <BottomNavigation />
    </PageWrapper>
  );
};

export default MyPage;

// ---------------- styled-components (기존 그대로) ----------------
const PageWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  min-height: 100%;
  container-type: inline-size;
`;

const Scontent = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
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
  font: var(--text-md-medium);
`;

const Email = styled.div`
  color: var(--colors-text-subtle, #a1a1aa);
  font: var(--text-sm-normal);
`;

const VisitVerifyButton = styled(Button)`
  display: flex;
  height: var(--sizes-8, 2rem);
  min-width: var(--sizes-8, 2rem);
  padding: 0.125rem var(--spacing-2_5, 0.625rem);
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  border-radius: var(--radii-full, 624.9375rem);
  background: var(--colors-gray-subtle, #f4f4f5);
  color: var(--colors-gray-fg, #27272a);
  font: var(--text-xs-medium);
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
  padding: 1rem;
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
  color: bg/default;
  font: var(--text-sm-medium);
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
