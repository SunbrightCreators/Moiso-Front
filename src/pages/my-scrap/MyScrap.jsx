import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Tabs, EmptyState } from '@chakra-ui/react';
import { TopNavigation } from '../../components/common/navigation';
import { ProposalItem } from '../../components/proposal';
import { FundingItem } from '../../components/funding';
import { ReactComponent as Frown } from '../../assets/icons/frown.svg';

export default function MyScrap() {
  const isProposerMode = true;
  const profile = isProposerMode ? 'proposer' : 'founder';

  // 탭
  const [tab, setTab] = useState('proposal');
  // 탭 변경
  const handleTabChange = ({ value }) => {
    setTab(value);
  };

  // 제안/펀딩 지역 드롭다운

  const AREAS = ['전체', '신촌동', '홍대입구'];
  const [areaP, setAreaP] = useState(AREAS[0]); // 제안
  const [areaF, setAreaF] = useState(AREAS[0]); // 펀딩
  const [openP, setOpenP] = useState(false);
  const [openF, setOpenF] = useState(false);
  const menuRefP = useRef(null);
  const menuRefF = useRef(null);

  // 목데이터
  const proposalList = Array.from({ length: 3 }, (_, i) => ({
    ...baseProposal,
    id: `p${i + 1}`,
  }));
  const fundingList = Array.from({ length: 3 }, (_, i) => ({
    ...baseFunding,
    id: `f${i + 1}`,
  }));

  // 제안
  const proposals = proposalList.filter(
    (it) => areaP === '전체' || it.address?.eupmyundong === areaP,
  );

  // 펀딩
  const fundings = fundingList.filter(
    (it) => areaF === '전체' || it.address?.eupmyundong === areaF,
  );
  return (
    <>
      <TopNavigation left='back' title='스크랩' />

      <Tabs.Root value={tab} onValueChange={handleTabChange} variant='line'>
        <TabsList>
          <TabsTrigger value='proposal'>제안</TabsTrigger>
          <TabsTrigger value='funding'>펀딩</TabsTrigger>
          <TabsIndicator />
        </TabsList>

        {/* 제안 탭 */}
        <Tabs.Content value='proposal'>
          <Toolbar>
            <Count>총 {proposals.length}개</Count>

            {/* 제안 드롭다운 */}
            <Dropdown ref={menuRefP}>
              <Trigger
                type='button'
                aria-haspopup='listbox'
                aria-expanded={openP}
                onClick={() => setOpenP((v) => !v)}
              >
                <span>{areaP}</span>
                <Chevron $open={openP}>▾</Chevron>
              </Trigger>

              {openP && (
                <Menu role='listbox' tabIndex={-1}>
                  {AREAS.map((name) => (
                    <MenuItem key={`p-${name}`}>
                      <button
                        type='button'
                        role='option'
                        aria-selected={areaP === name}
                        onClick={() => {
                          setAreaP(name);
                          setOpenP(false);
                        }}
                      >
                        {name}
                      </button>
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </Dropdown>
          </Toolbar>

          <Main>
            {proposals.length === 0 ? (
              <Empty>
                <EmptyState.Root>
                  <EmptyState.Content>
                    <EmptyState.Indicator>
                      <Frown width={32} height={32} />
                    </EmptyState.Indicator>
                    <CustomTitle>아직 스크랩한 글이 없어요 </CustomTitle>
                    <CustomDescription>
                      마음에 드는 글을 찾아 스크립해 보세요.
                    </CustomDescription>
                  </EmptyState.Content>
                </EmptyState.Root>
              </Empty>
            ) : (
              <List>
                {proposals.map((item) => (
                  <Item key={item.id}>
                    <ProposalItem proposal={item} profile={profile} />
                  </Item>
                ))}
              </List>
            )}
          </Main>
        </Tabs.Content>

        {/* 펀딩 탭 */}
        <Tabs.Content value='funding'>
          <Toolbar>
            <Count>총 {fundings.length}개</Count>

            {/* 펀딩 드롭다운 */}
            <Dropdown ref={menuRefF}>
              <Trigger
                type='button'
                aria-haspopup='listbox'
                aria-expanded={openF}
                onClick={() => setOpenF((v) => !v)}
              >
                <span>{areaF}</span>
                <Chevron $open={openF}>▾</Chevron>
              </Trigger>

              {openF && (
                <Menu role='listbox' tabIndex={-1}>
                  {AREAS.map((name) => (
                    <MenuItem key={`f-${name}`}>
                      <button
                        type='button'
                        role='option'
                        aria-selected={areaF === name}
                        onClick={() => {
                          setAreaF(name);
                          setOpenF(false);
                        }}
                      >
                        {name}
                      </button>
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </Dropdown>
          </Toolbar>

          <Main>
            {fundings.length === 0 ? (
              <Empty>
                <EmptyState.Root>
                  <EmptyState.Content>
                    <EmptyState.Indicator>
                      <Frown width={32} height={32} />
                    </EmptyState.Indicator>
                    <CustomTitle>아직 스크랩한 글이 없어요 </CustomTitle>
                    <CustomDescription>
                      마음에 드는 글을 찾아 스크립해 보세요.
                    </CustomDescription>
                  </EmptyState.Content>
                </EmptyState.Root>
              </Empty>
            ) : (
              <List>
                {fundings.map((item) => (
                  <Item key={item.id}>
                    <FundingItem funding={item} profile={profile} />
                  </Item>
                ))}
              </List>
            )}
          </Main>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

/* ---------------- styled-components ---------------- */

const TabsList = styled(Tabs.List)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom-width: 1px;
  position: sticky;
  background: #fff;
  z-index: 20;
`;

const TabsTrigger = styled(Tabs.Trigger)`
  justify-content: center;
  padding: 8px 0;
  font-weight: ${(props) => (props['data-state'] === 'active' ? '700' : '400')};
`;

const TabsIndicator = styled(Tabs.Indicator)`
  height: 2px;
  background-color: var(--chakra-colors-gray-900);
  bottom: -1px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.75rem;
  background: #fff;
`;

const Count = styled.span`
  color: var(--colors-fg-subtle, #a1a1aa);
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const Main = styled.main`
  padding: 12px 16px;
  display: grid;
  gap: 12px;
`;

const List = styled.ul`
  display: grid;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  min-width: 0;
  max-width: 100%;
`;

/* --- 드롭다운 --- */
const Dropdown = styled.div`
  position: relative;
`;

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem; /* 6px */
  padding: 0.375rem 0.625rem; /* 6px 10px */
  border-radius: 0.5rem; /* 8px */
  border: 0.0625rem solid #e5e7eb; /* 1px */
  background: #fff;
  font-size: 0.875rem;
  color: #111827;
  cursor: pointer;
`;

const Chevron = styled.span`
  font-size: 0.75rem;
  transition: transform 0.15s ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  opacity: 0.7;
`;

const Menu = styled.ul`
  position: absolute;
  right: 0;
  top: calc(100% + 0.375rem); /* +6px */
  min-width: 8.75rem; /* 140px */
  max-height: 20rem; /* 320px */
  overflow: auto;
  padding: 0.375rem;
  margin: 0;
  list-style: none;
  border: 0.0625rem solid #e5e7eb; /* 1px */
  border-radius: 0.625rem; /* 10px */
  background: #fff;
  box-shadow: 0 0.375rem 1.25rem rgba(17, 24, 39, 0.08);
  z-index: 1000; /* 레이어 최상단 */
  pointer-events: auto;
`;

const MenuItem = styled.li`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem; /* 8px */
    padding: 0.625rem 0.5rem; /* 10px 8px */
    border: 0;
    background: transparent;
    font-size: 0.875rem;
    color: #111827;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  button[aria-selected='true'] {
    background: #f3f4f6;
    font-weight: 600;
  }
  button:hover {
    background: #f9fafb;
  }
`;
/* --- Emptystate ---*/
const Empty = styled.div`
  padding: 4rem 1rem; /* 64px 16px */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem; /* 12px */
  text-align: center;
`;

const CustomTitle = styled(EmptyState.Title)`
  color: var(--colors-text-default, #27272a);
  text-align: center;

  /* md/semibold */
  font: var(--text-md-semibold);
`;

const CustomDescription = styled(EmptyState.Description)`
  color: var(--colors-text-muted, #52525b);
  text-align: center;

  /* sm/normal */
  font: var(--text-sm-normal);
`;

/* ---- 목데이터 ---- */
const baseProposal = {
  industry: 'Label',
  title: '제안글 제목',
  content: '제안을 실현할 작은 모임입니다.',
  business_hours: { start: '07:00', end: '22:00' },
  address: { sigungu: '서울 마포구', eupmyundong: '신촌동' },
  radius: '500m',
  image: [],
  user: { name: '홍길동' },
  created_at: '20분 전',
  is_liked: false,
  is_scrapped: true,
  likes_count: 173,
  scraps_count: 176,
};
const baseFunding = {
  industry: 'Label',
  title: '런칭 프로젝트 제목',
  summary: '런칭 프로젝트 설명입니다.',
  expected_opening_date: '2025-08',
  address: { sigungu: '서울 마포구', eupmyundong: '홍대입구' },
  radius: '500m',
  progress: {
    rate: Math.round((9_257_890 / 14_500_000) * 100),
    amount: 9_257_890,
  },
  days_left: 100,
  image: [],
  founder: { name: '제안자A' },
  schedule: { end: '2025-12-31' },
  is_liked: true,
  is_scrapped: true,
  likes_count: 178,
  scraps_count: 176,
};
