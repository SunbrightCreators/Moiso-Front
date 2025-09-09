import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import InputSearch from '../../components/common/input/InputSearch'; // 공통 검색바 사용

export default function PlaceSearchPage({ onPrevStep }) {
  const pick = (item) => {
    const label = `${item.title} ${item.sub}`; // 저장할 문자열 형태
    onPrevStep?.({ location: label }); // 값 저장 + 생성페이지로 복귀
  };
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return MOCK;
    return MOCK.filter((r) => r.title.includes(q) || r.sub.includes(q));
  }, [query]);

  return (
    <Page>
      <Header>
        <BackBtn type='button' aria-label='뒤로가기' onClick={onPrevStep}>
          {/* 간단한 기호로 아이콘 대체 (디자인 아이콘 있으면 교체) */}‹
        </BackBtn>

        {/* 검색폼: submit은 아직 의미 없으니 막아둠 */}
        <SearchForm onSubmit={(e) => e.preventDefault()}>
          <InputSearch
            name='place'
            placeholder=''
            onChange={(e) => setQuery(e.target.value)}
          />
        </SearchForm>
      </Header>

      <Main>
        <SectionTitle>근처 장소</SectionTitle>

        <List>
          {filtered.map((item) => (
            <Item key={item.id} type='button' onClick={() => pick(item)}>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemSub>{item.sub}</ItemSub>
            </Item>
          ))}
        </List>
      </Main>
    </Page>
  );
}

/* ========== styled ==========");
   모바일 폭(480px) 고정 컨테이너 + 상단 고정 헤더 + 본문 스크롤  */

const Page = styled.div`
  margin: 0 auto;
  max-width: 480px;
  height: 100dvh;
  background: #fff;
  position: relative;
  overflow: hidden; /* 윈도우 스크롤 막기 */
  --header-h: 64px; /* TopNavigation 실제 높이에 맞춰 56/60/64 중 선택 */
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  z-index: 20;
  background: #fff;
  display: grid;
  grid-template-columns: 44px 1fr;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  height: var(--header-h);
`;
const Main = styled.main`
  height: calc(100dvh - var(--header-h)); /* 헤더 제외한 나머지 */
  margin-top: var(--header-h); /* 헤더랑 겹치지 않게 */
  overflow: auto; /* 여기만 스크롤 */
  -webkit-overflow-scrolling: touch;
  padding: 16px; /* 상단 72px 패딩 제거 */
`;

const BackBtn = styled.button`
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  color: #111827;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  padding: 0 12px;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: var(--radii-md, 6px);
  background: var(--colors-bg-muted, #f4f4f5);
`;

const SectionTitle = styled.h3`
  display: flex;
  height: 36px;
  padding: var(--spacing-2, 8px) var(--spacing-3, 12px);
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: stretch;
`;

const List = styled.div`
  display: grid;
`;

const Item = styled.button`
  width: 100%;
  text-align: left;
  padding: 14px 0;
  background: #fff;
  border: 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
`;

const ItemTitle = styled.div`
  overflow: hidden;
  color: var(--colors-text-default, #27272a);
  text-overflow: ellipsis;
  white-space: nowrap;

  /* sm/normal */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 14px);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-sm, 20px); /* 142.857% */
`;

const ItemSub = styled.div`
  margin-top: 0.3rem;
  overflow: hidden;
  color: var(--colors-fg-subtle, #a1a1aa);
  text-overflow: ellipsis;
  white-space: nowrap;

  /* xs/normal */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 12px);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-xs, 16px); /* 133.333% */
`;

const MOCK = [
  { id: 1, title: '도로이름 건물번호 건물명', sub: '지번주소' },
  { id: 2, title: '이화여대길 52', sub: '서울특별시 서대문구 대현동 11-1' },
  {
    id: 3,
    title: '이화여대길 52 이화여자대학교',
    sub: '서울특별시 서대문구 대현동 11-1',
  },
  { id: 4, title: '이화여대길 52', sub: '서울특별시 서대문구 대현동 11-1' },
  { id: 5, title: '이화여대길 52', sub: '서울특별시 서대문구 대현동 11-1' },
  { id: 6, title: '이화여대길 52', sub: '서울특별시 서대문구 대현동 11-1' },
  { id: 7, title: '이화여대길 52', sub: '서울특별시 서대문구 대현동 11-1' },
  {
    id: 8,
    title: '이화여대길 52 이화여자대학교',
    sub: '서울특별시 서대문구 대현동 11-1',
  },
  { id: 9, title: '이화여대길 52', sub: '서울특별시 서대문구 대현동 11-1' },
  { id: 10, title: '이화여대길 52', sub: '서울특별시 서대문구 대현동 11-1' },
  { id: 11, title: '이화여대길 52', sub: '서울특별시 서대문구 대현동 11-1' },
  {
    id: 12,
    title: '이화여대길 52 이화여자대학교',
    sub: '서울특별시 서대문구 대현동 11-1',
  },
];
