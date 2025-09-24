import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@chakra-ui/react';
import { usePostLocationHistory } from '../../apis/accounts';
import { useGetPositionToLegal } from '../../apis/maps';
import { Dialog } from '../../components/common';
import { InputSearch } from '../../components/common/input';
import { TopNavigation } from '../../components/common/navigation';
import useDialogStore from '../../stores/useDialogStore';
import useModeStore from '../../stores/useModeStore';

const NeighborhoodSettingsPage = ({ onNextStep }) => {
  const { setConfirmDialog, setAlertDialog } = useDialogStore();
  const [isAuthComplete, setIsAuthComplete] = useState(false);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [coordinates, setCoordinates] = useState(null);

  const { isProposerMode } = useModeStore();

  const postLocationHistoryMutation = usePostLocationHistory();
  const {
    data: addressData,
    isLoading: isLoadingAddress,
    error: addressError,
    refetch: refetchAddress,
  } = useGetPositionToLegal(coordinates?.latitude, coordinates?.longitude);

  const topNavTitle = isProposerMode ? '제안자 가입' : '창업자 가입';
  const topNavSubTitle = isProposerMode ? '제안 동네 설정' : '관심 동네 설정';

  // —————————————————————————————————————————————————————————

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    });
  };

  // —————————————————————————————————————————————————————————
  const convertCoordinatesToAddress = async (latitude, longitude) => {
    try {
      console.log('Converting coordinates:', { latitude, longitude });
      // 좌표 상태 설정하여 useGetPositionToLegal hook 트리거
      setCoordinates({ latitude, longitude });

      // 쿼리가 실행되고 결과를 받을 때까지 기다림
      const result = await refetchAddress();
      console.log('API response:', result);

      if (
        result.data?.sido &&
        result.data?.sigungu &&
        result.data?.eupmyundong
      ) {
        return result.data;
      } else {
        console.error('Invalid response format:', result.data);
        throw new Error('주소 변환에 실패했습니다.');
      }
    } catch (error) {
      console.error('Address conversion error:', error);
      throw new Error('주소 변환에 실패했습니다.');
    }
  };
  // —————————————————————————————————————————————————————————

  const handleAuthentication = async (neighborhood) => {
    try {
      const location = await getCurrentLocation();

      const adressData = await convertCoordinatesToAddress(
        location.latitude,
        location.longitude,
      );

      const currentAddress = `${adressData.sido} ${adressData.sigungu} ${adressData.eupmyundong}`;

      try {
        await postLocationHistoryMutation.mutateAsync({
          timestamp: location.timestamp,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
        });
      } catch (error) {
        console.error('위치 기록 전송 실패:', error);
      }

      if (currentAddress === neighborhood) {
        setAlertDialog({
          title: '동네 인증이 완료되었어요',
          content: `현재 위치가 '${neighborhood}'으로 확인되었습니다.\n이제 동네 활동을 시작할 수 있어요.`,
          actionText: '확인',
          onAction: () => {
            console.log('인증 완료 및 확인');
            setIsAuthComplete(true);
            setSelectedNeighborhoods((prev) => [...prev, neighborhood]);
          },
        });
      } else {
        setAlertDialog({
          title: '현재 위치로 인증할 수 없어요',
          content: `현재 위치가 '신사동'이에요.\n동네 인증은 ${neighborhood}에서만 할 수 있어요.`,
          actionText: '확인',
        });
      }
    } catch (error) {
      console.error('인증 오류:', error);

      let errorText = '동네 인증에 실패했어요.';

      if (error.code === 1) {
        errorText = '위치 정보 사용이 거부되었어요.\n위치 권한을 허용해주세요.';
      } else if (error.code === 2) {
        errorText = '현재 위치를 찾을 수 없어요.\n 잠시 후 다시 시도해주세요.';
      } else if (error.code === 3) {
        errorText =
          '위치 정보를 가져오는 데 시간이 초과되었어요.\n 잠시 후 다시 시도해주세요.';
      } else if (error.message) {
        errorText = error.message;
      }

      setAlertDialog({
        title: '인증 실패',
        content: errorText,
        actionText: '확인',
      });
    }
  };

  const handleItemClick = (neighborhood) => {
    if (selectedNeighborhoods.length >= 2) {
      return;
    }
    setConfirmDialog({
      title: '동네 인증이 필요해요',
      content: `관심 동네로 등록하려면\n'${neighborhood}' 인증을 완료해야 합니다.`,
      actionText: '인증하기',
      onAction: () => handleAuthentication(neighborhood),
      onCancel: () => {
        console.log('인증 취소');
      },
    });
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
        <SearchInputContainer>
          <InputSearch />
        </SearchInputContainer>

        <ScrollableListContainer>
          <h3>동네 목록</h3>
          <NeighborhoodList>
            {neighborhoods.map((neighborhood, index) => (
              <NeighborhoodItem
                key={index}
                onClick={() => handleItemClick(neighborhood)}
              >
                {neighborhood}
              </NeighborhoodItem>
            ))}
          </NeighborhoodList>
        </ScrollableListContainer>
      </MainContent>
      {selectedNeighborhoods.length > 0 && (
        <TagContainer>
          {selectedNeighborhoods.map((neighborhood, index) => (
            <Tag key={index}>{neighborhood}</Tag>
          ))}
        </TagContainer>
      )}

      <BottomButtonContainer>
        <StyledButton
          width='100%'
          size='lg'
          disabled={!isAuthComplete}
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

const ScrollableListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
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

const HeadingSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchInputContainer = styled.div`
  margin-bottom: 1.5rem;
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
const StyledButton = styled(Button)`
  background-color: ${(props) => (props.isAuthComplete ? 'gray' : 'black')};
  color: white;
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

const neighborhoods = [
  '서울특별시 서대문구 대현동',
  '서울특별시 서대문구 대신동',
  '서울특별시 서대문구 신촌동',
  '서울특별시 서대문구 연희동',
  '서울특별시 서대문구 북아현동',
  '서울특별시 서대문구 홍제동',
  '서울특별시 서대문구 봉원동',
  '서울특별시 서대문구 창천동',
  '서울특별시 서대문구 홍은동',
  '서울특별시 서대문구 남가좌동',
];
