import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EmptyState } from '@chakra-ui/react';
import { TopNavigation } from '../../components/common/navigation';
import { ReactComponent as Frown } from '../../assets/icons/frown.svg';
import useModeStore from '../../stores/useModeStore';

import { useGetProfile } from '../../apis/accounts';
import { useGetProposalMyCreatedList } from '../../apis/proposals';

// 날짜 문자열 → ts
const toTs = (s) => {
  if (!s) return 0;
  const iso = Date.parse(s);
  if (!Number.isNaN(iso)) return iso;
  const m = String(s).match(
    /(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/,
  );
  if (!m) return 0;
  const [, Y, Mo, D, H = '00', Mi = '00'] = m;
  return new Date(+Y, +Mo - 1, +D, +H, +Mi).getTime();
};

const fmtDate = (s) => {
  const d = new Date(toTs(s));
  if (Number.isNaN(d.getTime())) return '';
  const Y = d.getFullYear();
  const M = d.getMonth() + 1;
  const D = d.getDate();
  return `${Y}. ${M}. ${D} 작성`;
};

const MyProposalPage = () => {
  const navigate = useNavigate();
  const { isProposerMode } = useModeStore(); // true=제안자, false=창업자
  const profile = isProposerMode ? 'proposer' : 'founder';

  const { data: profileRes } = useGetProfile(profile, ['address']); // accounts 훅으로 프로필 조회

  // ✅ 명세서 구조를 평탄화해서 주소 목록 뽑기
  const addressList = useMemo(() => {
    const d = profileRes?.data ?? profileRes ?? {};

    const root = Array.isArray(d?.address) ? d.address : [];

    const fromProposer =
      d?.proposer_profile?.proposer_level?.flatMap((lv) =>
        Array.isArray(lv?.address) ? lv.address : [],
      ) ?? [];

    const fromFounder =
      d?.founder_profile?.founder_level?.flatMap((lv) =>
        Array.isArray(lv?.address) ? lv.address : [],
      ) ?? [];

    // 최종 병합 + 유효한 항목만
    return [...root, ...fromProposer, ...fromFounder].filter(
      (a) => a && a.sido && a.sigungu && (a.eupmyundong || a.dong || a.name),
    );
  }, [profileRes]);

  // 드롭다운에 표시할 읍/면/동 리스트
  const eupList = useMemo(
    () =>
      addressList.map((a) => a.eupmyundong || a.dong || a.name).filter(Boolean),
    [addressList],
  );

  // 드롭다운 상태
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // 선택된 동네 (기본: 첫 번째)
  const [area, setArea] = useState('');
  useEffect(() => {
    if (!area && eupList.length > 0) setArea(eupList[0]);
  }, [eupList, area]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  // 선택된 동네에 대응하는 전체 주소 (API 파라미터 소스)
  const selectedAddr = useMemo(
    () =>
      addressList.find((a) => (a.eupmyundong || a.dong || a.name) === area) ||
      {},
    [addressList, area],
  );

  // 최종 API 파라미터
  const sido = selectedAddr.sido || '';
  const sigungu = selectedAddr.sigungu || '';
  const eupmyundong =
    selectedAddr.eupmyundong || selectedAddr.dong || selectedAddr.name || '';

  // ✅ 제안 목록 호출 (명세서: sido/sigungu/eupmyundong)
  const canFetch = !!eupmyundong;
  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
  } = useGetProposalMyCreatedList(sido, sigungu, eupmyundong, {
    enabled: canFetch,
  }); // 내부에서 URLSearchParams로 쿼리 구성됨:contentReference[oaicite:1]{index=1}

  // 응답 정규화: [{id,title,writtenAt,area}]
  const items = useMemo(() => {
    const raw =
      listData?.data?.proposals ??
      listData?.data?.list ??
      listData?.data ??
      listData ??
      [];
    const arr = Array.isArray(raw) ? raw : [];
    return arr
      .map((p) => ({
        id: p.id ?? p.proposal_id,
        title: p.title ?? p.name ?? '제안글 제목',
        writtenAt:
          p.created_at ??
          p.createdAt ??
          p.created_date ??
          p.created_at_ts ??
          '',
        area: area || '',
      }))
      .sort((a, b) => toTs(b.writtenAt) - toTs(a.writtenAt)); // 최신순
  }, [listData, area]);

  const total = items.length;
  const goDetail = (id) => navigate(`/proposal/${id}`);

  return (
    <Page>
      <ScrollArea>
        <TopNavigation left='back' title='내가 작성한 제안글' />

        <Toolbar>
          <Count>총 {total}개</Count>

          {/* 드롭다운 */}
          <Dropdown ref={menuRef}>
            <Trigger
              type='button'
              aria-haspopup='listbox'
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span>{area || '지역 선택'}</span>
              <Chevron $open={open}>▾</Chevron>
            </Trigger>

            {open && (
              <Menu role='listbox' tabIndex={-1}>
                {eupList.map((name) => (
                  <MenuItem key={name}>
                    <button
                      type='button'
                      role='option'
                      aria-selected={area === name}
                      onClick={() => {
                        setArea(name);
                        setOpen(false);
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

        <List>
          {items.map((it) => (
            <Item
              key={it.id}
              role='button'
              tabIndex={0}
              onClick={() => goDetail(it.id)}
              onKeyDown={(e) => (e.key === 'Enter' ? goDetail(it.id) : null)}
            >
              <Title>{it.title}</Title>
              <Meta>
                {area} · {fmtDate(it.writtenAt)}
              </Meta>
            </Item>
          ))}

          {!listLoading && (listError || items.length === 0) && (
            <Empty>
              <EmptyState.Root>
                <EmptyState.Content>
                  <EmptyState.Indicator>
                    <Frown width={32} height={32} />
                  </EmptyState.Indicator>
                  <CustomTitle>아직 작성한 제안글이 없어요 </CustomTitle>
                  <CustomDescription>
                    우리 동네에 생기길 바라는 가게를 제안해 보세요.
                  </CustomDescription>
                </EmptyState.Content>
              </EmptyState.Root>
            </Empty>
          )}
        </List>
      </ScrollArea>
    </Page>
  );
};

export default MyProposalPage;

/* ===== 스타일: 네가 보낸 것 그대로 ===== */
const Page = styled.div`
  margin: 0 auto;
  background: #fff;
  position: relative;
  overflow: hidden;
`;
const ScrollArea = styled.div`
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 0.0625rem solid #f1f1f3;
  margin-top: 1rem;
  z-index: 5;
`;
const Count = styled.span`
  color: var(--colors-fg-subtle, #a1a1aa);
  font: var(--text-sm-normal);
`;
const List = styled.div`
  padding: 0.5rem 1rem 1.5rem;
  display: grid;
  gap: 1rem;
`;
const Item = styled.div`
  cursor: pointer;
  padding: 0.625rem 0;
  display: grid;
  gap: 0.25rem;
  &:not(:last-child) {
    border-bottom: 0.0625rem solid #f3f4f6;
  }
`;
const Title = styled.p`
  font: var(--text-sm-medium);
`;
const Meta = styled.p`
  color: var(--colors-text-subtle, #a1a1aa);
  font: var(--text-xs-normal);
`;
const Dropdown = styled.div`
  position: relative;
  z-index: 11;
`;
const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid #e5e7eb;
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
  top: calc(100% + 0.375rem);
  min-width: 8.75rem;
  max-height: 20rem;
  overflow: auto;
  padding: 0.375rem;
  margin: 0;
  list-style: none;
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0.625rem;
  background: #fff;
  box-shadow: 0 0.375rem 1.25rem rgba(17, 24, 39, 0.08);
`;
const MenuItem = styled.li`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.5rem;
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
const Empty = styled.div`
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
`;
const CustomTitle = styled(EmptyState.Title)`
  color: var(--colors-text-default, #27272a);
  text-align: center;
  font: var(--text-md-semibold);
`;
const CustomDescription = styled(EmptyState.Description)`
  color: var(--colors-text-muted, #52525b);
  text-align: center;
  font: var(--text-sm-normal);
`;
