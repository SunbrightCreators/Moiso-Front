import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TopNavigation } from '../../components/common/navigation';
import useModeStore from '../../stores/useModeStore';
import EmptyProposer from '../../assets/EmptyProposer.svg';
import EmptySupporter from '../../assets/EmptySupporter.svg';

const MyFundingPage = () => {
  const { isProposerMode } = useModeStore();

  const navigate = useNavigate();
  const goFundingDetail = (id) => navigate(`/funding/${id}`);

  // '2025. 8. 25 마감 예정' 형태 → 타임스탬프
  const toTs = (s) => {
    const m = s.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
    if (!m) return 0;
    const [, Y, M, D] = m;
    return new Date(+Y, +M - 1, +D).getTime();
  };

  // 페이지 타이틀 & 섹션 라벨
  const title = isProposerMode
    ? '내가 후원한 펀딩 프로젝트'
    : '나의 펀딩 프로젝트';
  const label = isProposerMode
    ? { ing: '후원 진행 중', ok: '후원 성공', fail: '후원 실패' }
    : { ing: '펀딩 진행 중', ok: '펀딩 성공', fail: '펀딩 실패' };

  const SUPPORTED = OWNED; // 필요하면 주민용 배열 따로 세팅

  const data = isProposerMode ? SUPPORTED : OWNED;

  const groups = useMemo(() => {
    const byStatus = (st) =>
      data
        .filter((v) => v.status === st)
        .sort((a, b) => toTs(b.when) - toTs(a.when)); // 최신순

    return {
      ing: byStatus('ing'),
      ok: byStatus('ok'),
      fail: byStatus('fail'),
    };
  }, [data]);
  const isEmpty = data.length === 0;
  const emptyImage = isProposerMode ? EmptySupporter : EmptyProposer;

  return (
    <Page>
      {/* ScrollArea 안에 TopNavigation을 넣어야 sticky가 제대로 작동 */}
      <ScrollArea>
        <TopNavigation left='back' title={title} />
        {isEmpty ? (
          <EmptyWrap>
            <EmptyImg src={emptyImage} alt='empty' />
          </EmptyWrap>
        ) : (
          <>
            <Section>
              <SectionTitle>
                {label.ing} ({groups.ing.length})
              </SectionTitle>
              <List>
                {groups.ing.map((item) => (
                  <Item
                    key={item.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => goFundingDetail(item.id)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && goFundingDetail(item.id)
                    }
                  >
                    <Title>{item.title}</Title>
                    <Meta>{item.when}</Meta>
                  </Item>
                ))}
              </List>
            </Section>

            <Section>
              <SectionTitle>
                {label.ok} ({groups.ok.length})
              </SectionTitle>
              <List>
                {groups.ok.map((item) => (
                  <Item
                    key={item.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => goFundingDetail(item.id)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && goFundingDetail(item.id)
                    }
                  >
                    <Title>{item.title}</Title>
                    <Meta>{item.when}</Meta>
                  </Item>
                ))}
              </List>
            </Section>

            <Section>
              <SectionTitle>
                {label.fail} ({groups.fail.length})
              </SectionTitle>
              <List>
                {groups.fail.map((item) => (
                  <Item
                    key={item.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => goFundingDetail(item.id)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && goFundingDetail(item.id)
                    }
                  >
                    <Title>{item.title}</Title>
                    <Meta>{item.when}</Meta>
                  </Item>
                ))}
              </List>
            </Section>
          </>
        )}
      </ScrollArea>
    </Page>
  );
};

export default MyFundingPage;

const Page = styled.div`
  margin: 0 auto;
  max-width: 30rem; /* 480px */
  height: 100%;
  background: #fff;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  height: 100%;
  overflow: auto; /* 여기만 스크롤 */
  -webkit-overflow-scrolling: touch;
`;

const Section = styled.section`
  padding: 1rem; /* 16px */
`;

const SectionTitle = styled.h3`
  color: var(--colors-text-default, #27272a);

  /* md/semibold */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-md, 1.5rem);
`;

const List = styled.div`
  margin-top: 1rem;
  display: grid;
  gap: 1.2rem;
`;

const Item = styled.div`
  padding: 0.625rem 0; /* 10px 0 */
  border-bottom: 0.0625rem solid #f1f1f3; /* 1px */
`;

const Title = styled.p`
  margin: 0 0 0.25rem 0; /* 0 0 4px 0 */
  overflow: hidden;
  color: var(--colors-text-default, #27272a);
  text-overflow: ellipsis;
  white-space: nowrap;

  /* sm/medium */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const Meta = styled.p`
  color: var(--colors-text-subtle, #a1a1aa);

  /* xs/normal */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-xs, 1rem);
`;

const EmptyWrap = styled.div`
  padding: 1.5rem 1rem; /* 24px 16px */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem; /* 12px */
  text-align: center;
`;

const EmptyImg = styled.img`
  width: 13.75rem; /* 220px */
  max-width: 80%;
  height: auto;
  opacity: 0.95;
`;

//더미 데이터 (실데이터로 교체)
const OWNED = [
  {
    id: 1,
    title: '크라우드 펀딩 제목',
    status: 'ing',
    when: '2025. 8. 25 마감 예정',
  },
  {
    id: 2,
    title: '크라우드 펀딩 제목',
    status: 'ing',
    when: '2025. 9. 25 마감 예정',
  },
  {
    id: 3,
    title: '크라우드 펀딩 제목',
    status: 'ing',
    when: '2025. 10. 25 마감 예정',
  },
  {
    id: 4,
    title: '크라우드 펀딩 제목',
    status: 'ok',
    when: '2025. 7. 25 종료',
  },
  {
    id: 5,
    title: '크라우드 펀딩 제목',
    status: 'ok',
    when: '2025. 6. 25 종료',
  },
  {
    id: 6,
    title: '크라우드 펀딩 제목',
    status: 'ok',
    when: '2025. 5. 25 종료',
  },
  {
    id: 7,
    title: '크라우드 펀딩 제목',
    status: 'fail',
    when: '2025. 7. 25 종료',
  },
  {
    id: 8,
    title: '크라우드 펀딩 제목',
    status: 'fail',
    when: '2025. 6. 25 종료',
  },
  {
    id: 9,
    title: '크라우드 펀딩 제목',
    status: 'fail',
    when: '2025. 5. 25 종료',
  },
];
