// src/pages/MyScrap.jsx
import React, { Suspense } from 'react';
import TopNavigation from '../components/common/navigation/TopNavigation';
import useModeStore from '../stores/useModeStore';

const ProposalItemLazy = React.lazy(
  () => import('../components/proposal/ProposalList'),
);
const FundingItemLazy = React.lazy(
  () => import('../components/funding/FundingList'),
);

class ErrorBoundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError
      ? this.props.fallback || null
      : this.props.children;
  }
}

/* -------------------- 목데이터 -------------------- */
const baseProposal = {
  id: 'p1',
  label: 'Label',
  title: '제안글 제목',
  description: '제안을 실현할 작은 모임입니다.',
  timeInput: '07:00',
  timeInputEnd: '22:00',
  locationInput: '신촌역',
  additionalText: '500m',
  imageList: [],
  authorName: '홍길동',
  timeAgo: '20분 전',
  isLiked: false,
  isScraped: true,
  likeCount: 173,
  scrapCount: 176,
};
const baseFunding = {
  id: 'f1',
  label: 'Label',
  title: '런칭 프로젝트 제목',
  description: '런칭 프로젝트 설명입니다.',
  YearInput: 2025,
  MonthInput: 8,
  locationInput: '홍대입구역',
  additionalText: '500m',
  FundingAmount: 9257890,
  targetAmount: 14500000,
  end: '2025-12-31',
  imageList: [],
  authorName: '제안자A',
  uploadDate: '2025년 08월 12일',
  isLiked: true,
  isScraped: true,
  likeCount: 178,
  scrapCount: 176,
};
/* ------------------------------------------------ */

export default function MyScrap() {
  const { isProposerMode } = useModeStore(); // true=제안자, false=창업자
  const profile = isProposerMode ? 'proposer' : 'founder';

  const proposalList = Array.from({ length: 3 }, (_, i) => ({
    ...baseProposal,
    id: `p${i + 1}`,
  }));
  const fundingList = Array.from({ length: 3 }, (_, i) => ({
    ...baseFunding,
    id: `f${i + 1}`,
  }));

  const [tab, setTab] = React.useState('proposal');

  // ✅ 두 모드 모두 탭 노출, 라벨만 모드에 맞게
  const showFundingTab = true;
  const fundingTabLabel = profile === 'founder' ? '창업' : '펀딩';

  return (
    <>
      {/* 이 페이지 한정 모바일 오버플로우 방지 */}
      <style>{`
        #myscrap-root{max-width:100vw; overflow-x:hidden;}
        #myscrap-root *{box-sizing:border-box;}
        #myscrap-root img{max-width:100%; height:auto; display:block;}
        /* 카드가 px 고정이어도 강제 수축 허용 */
        #myscrap-root .fluid{min-width:0; max-width:100%;}
      `}</style>

      <div id='myscrap-root'>
        <TopNavigation left='back' title='스크랩' />

        {/* 탭 헤더 */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            padding: '8px 16px',
            borderBottom: '1px solid #eee',
          }}
        >
          <button
            onClick={() => setTab('proposal')}
            style={{ fontWeight: tab === 'proposal' ? 700 : 400 }}
          >
            제안
          </button>
          {showFundingTab && (
            <button
              onClick={() => setTab('funding')}
              style={{ fontWeight: tab === 'funding' ? 700 : 400 }}
            >
              {fundingTabLabel}
            </button>
          )}
        </div>

        {/* 리스트 */}
        <main style={{ padding: '12px 16px', display: 'grid', gap: 12 }}>
          {/* 제안 */}
          {tab === 'proposal' &&
            (proposalList.length === 0 ? (
              <Empty text='아직 스크랩한 글이 없어요' />
            ) : (
              <ul
                style={{
                  display: 'grid',
                  gap: 12,
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                {proposalList.map((item) => (
                  <li key={item.id} className='fluid'>
                    <ErrorBoundary fallback={<ProposalFallback data={item} />}>
                      <Suspense fallback={<SkeletonCard />}>
                        <ProposalItemLazy proposal={item} profile={profile} />
                      </Suspense>
                    </ErrorBoundary>
                  </li>
                ))}
              </ul>
            ))}

          {/* 펀딩/창업 */}
          {showFundingTab &&
            tab === 'funding' &&
            (fundingList.length === 0 ? (
              <Empty text={`아직 스크랩한 ${fundingTabLabel}이 없어요`} />
            ) : (
              <ul
                style={{
                  display: 'grid',
                  gap: 12,
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                {fundingList.map((item) => (
                  <li key={item.id} className='fluid'>
                    <ErrorBoundary fallback={<FundingFallback data={item} />}>
                      <Suspense fallback={<SkeletonCard />}>
                        <FundingItemLazy funding={item} profile={profile} />
                      </Suspense>
                    </ErrorBoundary>
                  </li>
                ))}
              </ul>
            ))}
        </main>
      </div>
    </>
  );
}

/* ===== Fallback & Skeleton & Empty ===== */
function SkeletonCard() {
  return (
    <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
      <div
        style={{ width: 80, height: 12, background: '#eee', marginBottom: 8 }}
      />
      <div
        style={{ width: 180, height: 14, background: '#eee', marginBottom: 8 }}
      />
      <div
        style={{
          width: '100%',
          height: 120,
          background: '#f5f5f5',
          borderRadius: 8,
        }}
      />
    </div>
  );
}
function Empty({ text }) {
  return (
    <div style={{ padding: '48px 0', textAlign: 'center', color: '#9CA3AF' }}>
      {text}
    </div>
  );
}
function ProposalFallback({ data }) {
  return (
    <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
      <div style={{ fontSize: 12, color: '#999' }}>{data.label}</div>
      <div style={{ fontWeight: 700, marginTop: 4 }}>{data.title}</div>
      <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
        {data.description}
      </div>
      <div style={{ fontSize: 12, color: '#777', marginTop: 6 }}>
        희망시간 {data.timeInput}~{data.timeInputEnd} · 희망장소{' '}
        {data.locationInput} · {data.additionalText}
      </div>
    </div>
  );
}
function FundingFallback({ data }) {
  const ratio = Math.min(
    100,
    Math.round((data.FundingAmount / data.targetAmount) * 100),
  );
  return (
    <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
      <div style={{ fontSize: 12, color: '#999' }}>{data.label}</div>
      <div style={{ fontWeight: 700, marginTop: 4 }}>{data.title}</div>
      <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
        {data.description}
      </div>
      <div style={{ fontSize: 12, color: '#d00', marginTop: 6 }}>
        {ratio}% {data.FundingAmount.toLocaleString()}원
      </div>
    </div>
  );
}
