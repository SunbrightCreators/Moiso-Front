import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Spinner } from '@chakra-ui/react';
import { usePostLocationHistory } from '../../apis/accounts';
import { client } from '../../apis/instance';
import { Dialog } from '../../components/common';
import { InputSearch } from '../../components/common/input';
import { TopNavigation } from '../../components/common/navigation';
import useDialogStore from '../../stores/useDialogStore';
import useModeStore from '../../stores/useModeStore';

//
import { useGetAddressToLegal } from '../../apis/maps'; // (default export인 경우)

const ENDPOINTS = {
  reverseGeocode: '/maps/reverse-geocoding/legal', // GET ?latitude&longitude
  nearby: '/maps/neighborhoods/nearby', // 필요 없으면 버튼 숨기세요
};

const NeighborhoodSettingsPage = ({ onNextStep }) => {
  const { setConfirmDialog, setAlertDialog } = useDialogStore();
  const [query, setQuery] = useState('');
  const [nearby, setNearby] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]); // 인증 완료된 라벨만 저장

  const { isProposerMode } = useModeStore();
  const postLocationHistoryMutation = usePostLocationHistory();

  const topNavTitle = isProposerMode ? '제안자 가입' : '창업자 가입';
  const topNavSubTitle = isProposerMode ? '제안 동네 설정' : '관심 동네 설정';

  // —————————————————————————————————————————————————————————
  const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });

  const reverseGeocode = async (latitude, longitude) => {
    const { data } = await client.get(ENDPOINTS.reverseGeocode, {
      params: new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
      }),
    });
    // 기대 형태: {sido, sigungu, eupmyundong}
    return data;
  };

  const getNearbyNeighborhoods = async (latitude, longitude) => {
    const { data } = await client.get(ENDPOINTS.nearby, {
      params: { latitude, longitude, radius: 1500 },
    });
    // 기대 형태: 배열 [{ id, address: {sido, sigungu, eupmyundong}, position: {...} }]
    return Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data)
        ? data
        : [];
  };

  const formatAddress = (itemOrAddress) => {
    const a = itemOrAddress?.address ? itemOrAddress.address : itemOrAddress;
    if (!a) return '';
    const { sido, sigungu, eupmyundong } = a;
    return [sido, sigungu, eupmyundong].filter(Boolean).join(' ');
  };

  const sameAddr = (a, b) =>
    a?.sido === b?.sido &&
    a?.sigungu === b?.sigungu &&
    a?.eupmyundong === b?.eupmyundong;

  // —————————————————————————————————————————————————————————
  // ✅ 훅은 수정하지 않고 그대로 사용
  const searchEnabled = query.trim().length >= 2; // UX용 최소 2자
  const hookArg = searchEnabled ? query.trim() : '';
  // 아래 import 라인에 맞춰 훅 호출 명을 맞추세요.
  const hookResult =
    typeof useGetAddressToLegal === 'function'
      ? useGetAddressToLegal(hookArg)
      : { data: undefined, isFetching: false, error: undefined };

  const {
    data: resp,
    isFetching: loadingSearch,
    error: searchError,
  } = hookResult;
  // 훅이 AxiosResponse를 반환하므로 data에서 꺼냄(서버는 배열 응답)
  const searchResults = useMemo(() => {
    const raw = resp?.data ?? resp; // 혹시 훅에서 select를 이미 썼다면 resp가 곧 배열일 수 있음
    return Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw)
        ? raw
        : [];
  }, [resp]);

  const listToShow = searchEnabled ? searchResults : nearby;
  const loading = searchEnabled ? loadingSearch : loadingNearby;
  const error = searchEnabled ? searchError : null;

  // —————————————————————————————————————————————————————————
  const handleFindNearby = async () => {
    try {
      const loc = await getCurrentLocation();

      // (선택) 위치 기록은 그대로
      try {
        await postLocationHistoryMutation.mutateAsync({
          timestamp: loc.timestamp,
          latitude: loc.latitude,
          longitude: loc.longitude,
          accuracy: loc.accuracy,
        });
      } catch {}

      // 역지오코딩으로 법정동 주소 가져오기
      const addr = await reverseGeocode(loc.latitude, loc.longitude);
      const label = formatAddress(addr); // "서울특별시 서대문구 대현동"

      // 바로 인증 다이얼로그
      setConfirmDialog({
        title: '현재 위치로 인증할까요?',
        content: label,
        actionText: '이 동네 인증',
        onAction: () => handleAuthentication(addr, label), // expectedAddress=addr
      });
    } catch (e) {
      let msg = '현재 위치를 가져오지 못했습니다.';
      if (e?.code === 1) msg = '위치 권한을 허용해주세요.';
      else if (e?.code === 2)
        msg = '현재 위치를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.';
      else if (e?.code === 3)
        msg = '위치 정보 요청이 시간 초과되었습니다. 다시 시도해주세요.';
      setAlertDialog({ title: '안내', content: msg, actionText: '확인' });
    }
  };

  const handleItemClick = (item) => {
    if (selectedNeighborhoods.length >= 2) return;
    const label = formatAddress(item);
    const expected = item.address ? item.address : item; // 인증 비교용 순수 주소 객체
    setConfirmDialog({
      title: '동네 인증이 필요해요',
      content: `관심 동네로 등록하려면
'${label}' 인증을 완료해야 합니다.`,
      actionText: '인증하기',
      onAction: () => handleAuthentication(expected, label),
    });
  };

  const handleAuthentication = async (expectedAddress, displayLabel) => {
    try {
      const loc = await getCurrentLocation();
      const current = await reverseGeocode(loc.latitude, loc.longitude);

      try {
        await postLocationHistoryMutation.mutateAsync({
          timestamp: loc.timestamp,
          latitude: loc.latitude,
          longitude: loc.longitude,
          accuracy: loc.accuracy,
        });
      } catch {}

      if (sameAddr(current, expectedAddress)) {
        setAlertDialog({
          title: '동네 인증 완료',
          content: `현재 위치가 '${displayLabel}'으로 확인되었습니다.`,
          actionText: '확인',
          onAction: () =>
            setSelectedNeighborhoods((prev) =>
              prev.includes(displayLabel)
                ? prev
                : [...prev, displayLabel].slice(0, 2),
            ),
        });
      } else {
        setAlertDialog({
          title: '인증 불가',
          content: `현재 위치는 '${formatAddress(current)}'입니다.
'${displayLabel}'에서만 인증할 수 있어요.`,
          actionText: '확인',
        });
      }
    } catch (e) {
      let errorText = '동네 인증에 실패했습니다.';
      if (e?.code === 1) errorText = '위치 권한을 허용해주세요.';
      else if (e?.code === 2)
        errorText = '현재 위치를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.';
      else if (e?.code === 3)
        errorText = '위치 정보 요청이 시간 초과되었습니다. 다시 시도해주세요.';
      else if (e?.response?.status === 401)
        errorText = '로그인이 만료되었습니다. 다시 로그인해주세요.';
      setAlertDialog({
        title: '인증 실패',
        content: errorText,
        actionText: '확인',
      });
    }
  };

  return (
    <PageContainer>
      <TopNavigation
        left='back'
        title={topNavTitle}
        subTitle={topNavSubTitle}
      />

      <MainContent>
        <HeadingSection>
          <h1>우리 동네를 설정해주세요</h1>
          <p>최대 2개까지 설정 가능해요</p>
        </HeadingSection>

        <SearchRow>
          <SearchInputContainer>
            <InputSearch
              value={query}
              onChange={(e) => setQuery(e.target?.value ?? e)}
              placeholder='동네, 도로명, 건물명 검색'
            />
          </SearchInputContainer>
          <GeoButton onClick={handleFindNearby} disabled={loadingNearby}>
            {loadingNearby ? <Spinner size='sm' /> : '현 위치로 찾기'}
          </GeoButton>
        </SearchRow>

        <ScrollableListContainer>
          <ListHeader>
            {searchEnabled ? '검색 결과' : '근처 동네 추천'}
          </ListHeader>

          {error && <EmptyState>오류가 발생했습니다.</EmptyState>}
          {!error && loading && <EmptyState>불러오는 중…</EmptyState>}
          {!error && !loading && listToShow.length === 0 && (
            <EmptyState>
              {searchEnabled
                ? '검색 결과가 없습니다. 검색어를 바꿔보세요.'
                : '현 위치로 찾기를 눌러 근처 동네를 불러오세요.'}
            </EmptyState>
          )}

          {!error && !loading && listToShow.length > 0 && (
            <NeighborhoodList>
              {listToShow.map((it) => (
                <NeighborhoodItem
                  key={it.id ?? formatAddress(it)}
                  onClick={() => handleItemClick(it)}
                >
                  {formatAddress(it)}
                </NeighborhoodItem>
              ))}
            </NeighborhoodList>
          )}
        </ScrollableListContainer>
      </MainContent>

      {selectedNeighborhoods.length > 0 && (
        <TagContainer>
          {selectedNeighborhoods.map((n, i) => (
            <Tag key={i}>{n}</Tag>
          ))}
        </TagContainer>
      )}

      <BottomButtonContainer>
        <StyledButton
          width='100%'
          size='lg'
          disabled={selectedNeighborhoods.length === 0}
          onClick={() => onNextStep?.({ neighborhoods: selectedNeighborhoods })}
        >
          다음
        </StyledButton>
      </BottomButtonContainer>

      <Dialog />
    </PageContainer>
  );
};

export default NeighborhoodSettingsPage;

// —————————————————————————————————————————————————————————
// styles
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  overflow: hidden;
`;

const HeadingSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const SearchInputContainer = styled.div``;

const GeoButton = styled(Button)`
  white-space: nowrap;
`;

const ScrollableListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListHeader = styled.h3`
  font-size: 0.95rem;
  color: #52525b;
  margin: 0.25rem 0 0.5rem 0;
`;

const NeighborhoodList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NeighborhoodItem = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1rem;
  border-bottom: 0.0625rem solid #e2e8f0;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

const BottomButtonContainer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 1.5rem;
  padding-top: 0;
  background-color: white;
`;

const StyledButton = styled(Button)`
  background-color: #000;
  color: #fff;
  &:disabled {
    background-color: #a1a1aa;
    cursor: not-allowed;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #f4f4f5;
  border-radius: 9999px;
  color: #27272a;
  font-size: 0.875rem;
`;
const EmptyState = styled.div`
  padding: 1rem;
  color: #6b7280;
`;
