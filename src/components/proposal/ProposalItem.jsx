import React from 'react';
import styled from 'styled-components';
import { Avatar, Badge, DataList } from '@chakra-ui/react';
import Carousel from '../common/Carousel.jsx';
import DefaultImageSrc from '../../assets/default_image.svg';
import DefaultHeartIcon from '../../assets/icons/heart_default.svg';
import DisabledHeartIcon from '../../assets/icons/heart_disabled.svg';
import ActiveHeartIcon from '../../assets/icons/heart_pressed.svg';
import DefaultScrapIcon from '../../assets/icons/scrap_default.svg';
import ActiveScrapIcon from '../../assets/icons/scrap_pressed.svg';

// ———————————————————————————————————————————

/**
 * ProposalItem 컴포넌트
 * 개별 제안글 아이템을 렌더링하는 컴포넌트
 *
 * @param {Object} proposal - 제안글 데이터
 * @param {Function} onLike - 좋아요 토글 함수
 * @param {Function} onScrap - 스크랩 토글 함수
 * @param {string} profile - 사용자 타입 ('founder' | 'proposer')
 */
const ProposalItem = ({ proposal, onLike, onScrap, profile = 'proposer' }) => {
  const handleLikeClick = (proposalId) => {
    if (onLike) {
      onLike(proposalId);
    }
  };

  const handleScrapClick = (proposalId) => {
    if (onScrap) {
      onScrap(proposalId);
    }
  };

  // ———————————————————————————————————————————

  return (
    <SProposalCard>
      <SBadgeWrapper>
        <Badge>{proposal.industry}</Badge>
      </SBadgeWrapper>

      <STitleWrapper>
        <STitle>{proposal.title}</STitle>
      </STitleWrapper>

      <SDescriptionWrapper>
        <SDescription>{proposal.content}</SDescription>
      </SDescriptionWrapper>

      <SDataListWrapper>
        <DataList.Root orientation='horizontal'>
          <SCustomItem>
            <SCustomLabel>희망시간</SCustomLabel>
            <SCustomValue>
              {proposal.business_hours.start} - {proposal.business_hours.end}
            </SCustomValue>
          </SCustomItem>
          <SCustomItem>
            <SCustomLabel>희망장소</SCustomLabel>
            <SCustomValue>
              {proposal.address.sigungu} {proposal.address.eupmyundong} +{' '}
              {proposal.radius}
            </SCustomValue>
          </SCustomItem>
        </DataList.Root>
      </SDataListWrapper>

      <SImageCarouselWrapper>
        <Carousel gap='0.5rem'>
          {Array.from({ length: 3 }, (_, index) => {
            const hasImage = proposal.image && proposal.image[index];
            return (
              <SImageItem key={index}>
                <SImage
                  src={hasImage ? proposal.image[index] : DefaultImageSrc}
                  alt={hasImage ? `제안글 이미지 ${index + 1}` : '기본 이미지'}
                />
              </SImageItem>
            );
          })}
        </Carousel>
      </SImageCarouselWrapper>

      <SFooterWrapper>
        <SUserInfoContainer>
          <Avatar.Root size='xs'>
            <Avatar.Fallback name={proposal.user.name} />
          </Avatar.Root>
          {proposal.user.name}
          <SSeparator>|</SSeparator>
          <STimeAgo>{proposal.created_at}</STimeAgo>
        </SUserInfoContainer>

        <SActionContainer>
          <SLikeButtonWrapper>
            <LikeButton
              checked={proposal.is_liked && profile === 'proposer'}
              disabled={profile === 'founder'}
              onChange={() =>
                profile === 'proposer' && handleLikeClick(proposal.id)
              }
              onClick={(e) => e.stopPropagation()}
            />
            <SActionCount
              $isActive={profile === 'proposer' && proposal.is_liked}
              $isDisabled={profile === 'founder'}
            >
              {proposal.likes_count}
            </SActionCount>
          </SLikeButtonWrapper>

          <SScrapButtonWrapper>
            <ScrapButton
              checked={proposal.is_scrapped}
              onChange={() => handleScrapClick(proposal.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <SScrapActionCount $isActive={proposal.is_scrapped}>
              {proposal.scraps_count}
            </SScrapActionCount>
          </SScrapButtonWrapper>
        </SActionContainer>
      </SFooterWrapper>
    </SProposalCard>
  );
};

// Styled Components
const SProposalCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  gap: 0.6rem;
  box-sizing: border-box;
`;

const SBadgeWrapper = styled.div`
  display: flex;
  margin-bottom: 0.2rem;
`;

const STitleWrapper = styled.div`
  display: flex;
  flex: 1 0 0;
`;

const STitle = styled.h3`
  color: var(--colors-text-default, #27272a);
  /* md/semibold */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-2xs, 0.875rem); /* 133.333% */
`;

const SDescriptionWrapper = styled.div`
  display: flex;
`;

const SDescription = styled.p`
  color: var(--colors-text-default, #27272a);
  /* sm/normal */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  margin-bottom: 0.4rem;
`;

const SDataListWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-1_5, 0.375rem);
`;

const SCustomLabel = styled(DataList.ItemLabel)`
  color: var(--colors-text-subtle, #a1a1aa);
  /* xs/medium */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: 0.35rem;
  min-width: 3.5rem;
`;

const SCustomItem = styled(DataList.Item)`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-1_5, 0.375rem);
  line-height: 0.35rem;
`;

const SCustomValue = styled(DataList.ItemValue)`
  color: var(--colors-text-muted, #52525b);
  /* xs/normal */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: 0.35rem;
`;

const SImageCarouselWrapper = styled.div`
  width: 100%;
  margin-top: 0.75rem;
`;

const SImageItem = styled.div`
  width: 10rem;
  height: 7.5rem;
  flex-shrink: 0;
`;

const SImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
`;

const SFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 1.5rem;
  flex-wrap: nowrap;
`;

const SUserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--colors-text-subtle, #a1a1aa);
  /* xs/medium */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-xs, 1rem); /* 133.333% */
`;

const SSeparator = styled.span`
  stroke-width: 1px;
  stroke: var(--colors-border-default, #e4e4e7);
`;

const STimeAgo = styled.span`
  color: var(--colors-text-subtle, #a1a1aa);
  /* xs/medium */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-xs, 1rem); /* 133.333% */
`;

// ————————————— Like 랑 Scrap 버튼 쪽 영역 스타일링 ———————————————

const LikeButton = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: var(--sizes-4, 1rem);
  height: var(--sizes-4, 1rem);
  background: url(${DefaultHeartIcon}) no-repeat center/contain;
  cursor: pointer;

  &:checked {
    background: url(${ActiveHeartIcon}) no-repeat center/contain;
  }

  &:disabled {
    background: url(${DisabledHeartIcon}) no-repeat center/contain;
    cursor: not-allowed;
  }
`;

const ScrapButton = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: var(--sizes-4, 1rem);
  height: var(--sizes-4, 1rem);
  background: url(${DefaultScrapIcon}) no-repeat center/contain;
  cursor: pointer;

  &:checked {
    background: url(${ActiveScrapIcon}) no-repeat center/contain;
  }
`;

const SActionContainer = styled.div`
  display: grid;
  grid-template-columns: 2rem 2.5rem;
  gap: 1rem;
  align-items: center;
  min-height: 1.25rem;
  flex-shrink: 0;
  justify-content: flex-end;
`;

// 좋아요 버튼 래퍼를 지정하지 않으면 좋아요 수에 따라 크기가 변해서..
const SLikeButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 2.5rem;
  height: 1.25rem;
  gap: 0.2rem;
`;

// 스크랩 버튼 래퍼 - 고정 위치
const SScrapButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 2.5rem;
  height: 1.25rem;
  gap: 0.2rem;
`;

const SActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  background: none;
  border: none;
  cursor: ${(props) => (props.$isDisabled ? 'default' : 'pointer')};
  color: var(--colors-text-subtle, #a1a1aa);
  font-size: 0.875rem;
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};
  padding: 0;
  width: 100%;
  height: 100%;

  // icon 컨테이너랑 이미지 스타일
  div {
    flex-shrink: 0;
    width: 1rem !important;
    height: 1rem !important;
  }

  img {
    width: 1rem !important;
    height: 1rem !important;
    object-fit: contain;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

const SActionCount = styled.span`
  /* xs/medium */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-xs, 1rem); /* 133.333% */

  color: ${(props) => {
    if (props.$isDisabled) {
      // 비활성 상태일 때 (founder 모드)
      return 'var(--colors-text-subtle, #a1a1aa)';
    }
    if (props.$isActive) {
      // 활성 상태일 때 색깔
      return 'var(--colors-red-solid, #DC2626)';
    }
    return 'var(--colors-bg-default, #27272a)';
  }};
`;

const SScrapActionCount = styled.span`
  /* xs/medium */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-xs, 1rem); /* 133.333% */

  color: ${(props) => {
    if (props.$isActive) {
      // 스크랩 활성 상태일 때의 색상
      return 'var(--colors-yellow-focusRing, #FACC15)';
    }
    return 'var(--colors-bg-default, #27272a)';
  }};
`;

export default ProposalItem;
