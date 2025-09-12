import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TopNavigation from '../../components/common/navigation/TopNavigation';
import { useNavigate } from 'react-router-dom';
import emptyImg from '../../assets/icons/frown.svg';
import { EmptyState } from '@chakra-ui/react';

const MyProposalPage = () => {
  const total = 3;
  const navigate = useNavigate();

  const AREAS = ['대현동', '아현동'];
  const [area, setArea] = useState(AREAS[0]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toTs = (s) => {
    const m = s.match(/(\d{4})\.\s*(\d{2})\.\s*(\d{2})(?:\s+(\d{2}):(\d{2}))?/);
    if (!m) return 0;
    const [, Y, Mo, D, H = '00', Mi = '00'] = m;
    return new Date(+Y, +Mo - 1, +D, +H, +Mi).getTime();
  };

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const items = MOCK_ITEMS.filter((it) => it.area === area).sort(
    (a, b) => toTs(b.writtenAt) - toTs(a.writtenAt),
  ); // 최신순(내림차순)

  // 상세 페이지 이동
  const goDetail = (id) => {
    navigate(`/proposal/${id}`);
  };
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
              <span>{area}</span>
              <Chevron $open={open}>▾</Chevron>
            </Trigger>

            {open && (
              <Menu role='listbox' tabIndex={-1}>
                {AREAS.map((name) => (
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
                {it.area} · {it.writtenAt}
              </Meta>
            </Item>
          ))}

          {items.length === 0 && (
            <Empty>
              <EmptyState.Root>
                <EmptyState.Content>
                  <EmptyState.Indicator>
                    <img src={emptyImg} width='32' height='32' />
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
  padding: 0.75rem 1rem; /* 12px 16px */
  border-bottom: 0.0625rem solid #f1f1f3; /* 1px */
  margin-top: 1rem;
  z-index: 5;
`;

const Count = styled.span`
  color: var(--colors-fg-subtle, #a1a1aa);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const List = styled.div`
  padding: 0.5rem 1rem 1.5rem; /* 8px 16px 24px */
  display: grid;
  gap: 1rem; /* 16px */
`;

const Item = styled.div`
  cursor: pointer;
  padding: 0.625rem 0; /* 10px 0 */
  display: grid;
  gap: 0.25rem; /* 4px */
  &:not(:last-child) {
    border-bottom: 0.0625rem solid #f3f4f6; /* 1px */
  }
`;

const Title = styled.p`
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const Meta = styled.p`
  color: var(--colors-text-subtle, #a1a1aa);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-xs, 1rem);
`;

const Dropdown = styled.div`
  position: relative;
  z-index: 11;
`;

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem; /* 6px */
  padding: 0.375rem 0.625rem; /* 6px 10px */
  border-radius: 0.5rem; /* 8px */
  border: 0.0625rem solid #e5e7eb; /* 1px */
  background: #fff;
  font-size: 0.875rem; /* 14px */
  color: #111827;
  cursor: pointer;
`;

const Chevron = styled.span`
  font-size: 0.75rem; /* 12px */
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
  padding: 0.375rem; /* 6px */
  margin: 0;
  list-style: none;
  border: 0.0625rem solid #e5e7eb; /* 1px */
  border-radius: 0.625rem; /* 10px */
  background: #fff;
  box-shadow: 0 0.375rem 1.25rem rgba(17, 24, 39, 0.08); /* 0 6px 20px */
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
    font-size: 0.875rem; /* 14px */
    color: #111827;
    border-radius: 0.5rem; /* 8px */
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
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-md, 1.5rem); /* 150% */
`;

const CustomDescription = styled(EmptyState.Description)`
  color: var(--colors-text-muted, #52525b);
  text-align: center;

  /* sm/normal */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-sm, 1.25rem); /* 142.857% */
`;

/*목데이터 */
const MOCK_ITEMS = [
  {
    id: 101,
    title: '소상공인 야시장 운영 제안',
    area: '대현동',
    writtenAt: '2025. 08. 13 14:30',
  },
  {
    id: 103,
    title: '청년 창업 팝업존 유치',
    area: '대현동',
    writtenAt: '2025. 08. 02 09:20',
  },
  {
    id: 104,
    title: '야간 문화공연 상시 개최',
    area: '대현동',
    writtenAt: '2025. 08. 06 19:00',
  },
];
