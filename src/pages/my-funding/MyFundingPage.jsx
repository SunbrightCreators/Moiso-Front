import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { EmptyState } from '@chakra-ui/react';
import { ROUTE_PATH } from '../../constants/route';
import { TopNavigation } from '../../components/common/navigation';
import useModeStore from '../../stores/useModeStore';
import { ReactComponent as Frown } from '../../assets/icons/frown.svg';

import {
  useGetFundingMyCreatedList,
  useGetFundingMyPaidList,
} from '../../apis/fundings';

const MyFundingPage = () => {
  const { isProposerMode } = useModeStore();

  const toArray = (res) => {
    const d = res?.data ?? res;

    //  서버가 상태별 키로 준 경우: 평탄화 + status 주입
    if (
      d &&
      typeof d === 'object' &&
      (Array.isArray(d.in_progress) ||
        Array.isArray(d.succeeded) ||
        Array.isArray(d.failed))
    ) {
      const add = (arr, st) =>
        Array.isArray(arr)
          ? arr.map((x) => ({ ...x, status: x.status ?? st }))
          : [];
      return [
        ...add(d.in_progress, 'ing'),
        ...add(d.succeeded, 'ok'),
        ...add(d.failed, 'fail'),
      ];
    }

    const walk = (x) => {
      if (!x) return null;
      if (Array.isArray(x)) return x;
      if (typeof x === 'object') {
        for (const k of [
          'data',
          'content',
          'items',
          'list',
          'results',
          'records',
          'rows',
        ]) {
          const got = walk(x[k]);
          if (got) return got;
        }
      }
      return null;
    };
    return walk(d) ?? [];
  };
  console.log('isProposerMode:', isProposerMode);
  const {
    data: createdRes,
    isLoading: createdLoading,
    isError: createdError,
  } = useGetFundingMyCreatedList(isProposerMode);
  const {
    data: paidRes,
    isLoading: paidLoading,
    isError: paidError,
  } = useGetFundingMyPaidList(isProposerMode);

  const raw = isProposerMode ? toArray(paidRes) : toArray(createdRes);
  const loading = isProposerMode ? paidLoading : createdLoading;
  const error = isProposerMode ? paidError : createdError;
  const data = raw;
  console.log('createdRes:', createdRes?.data ?? createdRes);
  console.log('paidRes:', paidRes?.data ?? paidRes);

  // '2025. 8. 25 마감 예정' 형태 → 타임스탬프
  const toTs = (s) => {
    if (!s) return 0;
    const m1 = s.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
    if (m1) {
      const [, Y, M, D] = m1;
      return new Date(+Y, +M - 1, +D).getTime();
    }
    const m2 = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m2) {
      const [, Y, M, D] = m2;
      return new Date(+Y, +M - 1, +D).getTime();
    }
    const t = Date.parse(s);
    return Number.isNaN(t) ? 0 : t;
  };

  // 페이지 타이틀 & 섹션 라벨
  const title = isProposerMode
    ? '내가 후원한 펀딩 프로젝트'
    : '나의 펀딩 프로젝트';
  const label = isProposerMode
    ? { ing: '후원 진행 중', ok: '후원 성공', fail: '후원 실패' }
    : { ing: '펀딩 진행 중', ok: '펀딩 성공', fail: '펀딩 실패' };

  const groups = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const byStatus = (st) =>
      list
        .filter((v) => v.status === st)
        // 정렬 기준: schedule.end 우선, 없으면 when(문자열) 백업
        .sort(
          (a, b) =>
            toTs(b?.schedule?.end ?? b?.when) -
            toTs(a?.schedule?.end ?? a?.when),
        );
    return { ing: byStatus('ing'), ok: byStatus('ok'), fail: byStatus('fail') };
  }, [data]);
  const isEmpty = data.length === 0;
  return (
    <Page>
      {/* ScrollArea 안에 TopNavigation을 넣어야 sticky가 제대로 작동 */}
      <ScrollArea>
        <TopNavigation left='back' title={title} />
        {loading ? (
          <FundingEmpty>
            <EmptyState.Content>로딩 중…</EmptyState.Content>
          </FundingEmpty>
        ) : error ? (
          <FundingEmpty>
            <EmptyState.Content>
              <EmptyState.Title>목록을 불러오지 못했어요</EmptyState.Title>
              <EmptyState.Description>
                잠시 후 다시 시도해 주세요.
              </EmptyState.Description>
            </EmptyState.Content>
          </FundingEmpty>
        ) : isEmpty ? (
          <FundingEmpty aria-label='내 펀딩 목록이 비어있음'>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <Frown width={32} height={32} />
              </EmptyState.Indicator>

              <CustomTitle>
                {isProposerMode
                  ? '아직 후원한 프로젝트가 없어요'
                  : '아직 등록된 펀딩 프로젝트가 없어요'}
              </CustomTitle>

              <CustomDescription>
                {isProposerMode
                  ? '마음을 움직이는 프로젝트를 찾아 후원해 보세요.'
                  : '마음에 드는 제안을 선택해 펀딩을 열어보세요.'}
              </CustomDescription>
            </EmptyState.Content>
          </FundingEmpty>
        ) : (
          <>
            <Section>
              <SectionTitle>
                {label.ing} ({groups.ing.length})
              </SectionTitle>
              <List>
                {groups.ing.map((item) => (
                  <Item key={item.id}>
                    <ItemLink to={ROUTE_PATH.FUNDING_DETAIL(item.id)}>
                      <Title>{item.title}</Title>
                      <Meta>{item?.schedule?.end ?? item?.when}</Meta>
                    </ItemLink>
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
                  <Item key={item.id}>
                    <ItemLink to={ROUTE_PATH.FUNDING_DETAIL(item.id)}>
                      <Title>{item.title}</Title>
                      <Meta>{item?.schedule?.end ?? item?.when}</Meta>
                    </ItemLink>
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
                  <Item key={item.id}>
                    <ItemLink to={ROUTE_PATH.FUNDING_DETAIL(item.id)}>
                      <Title>{item.title}</Title>
                      <Meta>{item?.schedule?.end ?? item?.when}</Meta>
                    </ItemLink>
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
  font: var(--text-md-semibold);
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
  -webkit-line-clamp: 2;

  /* sm/medium */

  font: var(--text-sm-medium);
`;

const ItemLink = styled(Link)`
  display: block;
  width: 100%;
`;

const Meta = styled.p`
  color: var(--colors-text-subtle, #a1a1aa);
  -webkit-line-clamp: 2;

  /* xs/normal */
  font: var(--text-xs-normal);
`;

const FundingEmpty = styled(EmptyState.Root)`
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
