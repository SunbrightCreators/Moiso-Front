import styled from 'styled-components';
import { Badge, Avatar } from '@chakra-ui/react';
import HeartDefault from '../../../assets/icons/heart_default.svg';
import HeartPressed from '../../../assets/icons/heart_pressed.svg';
import HeartDisabled from '../../../assets/icons/heart_disabled.svg';
import ScrapDefault from '../../../assets/icons/scrap_default.svg';
import ScrapPressed from '../../../assets/icons/scrap_pressed.svg';

const BigCard = ({ item, liked, scrapped, onToggleLike, onToggleScrap }) => {
  return (
    <OverlayCard>
      <LargeBody>
        <Tag>
          <Badge
            variant='subtle'
            size='md'
            bg='#111827'
            color='white'
            borderRadius='999px'
            fontSize='12px'
            fontWeight='400'
          >
            {item.industry}
          </Badge>
        </Tag>
        <LargeTitle>{item.title}</LargeTitle>
        <LargeDesc>{item.content}</LargeDesc>

        <HeaderRow>
          <HeaderLeft>
            <Avatar.Root shape='full' size='xs'>
              <Avatar.Fallback
                name={item.user?.name}
                src={item.user?.profile_image}
              />
            </Avatar.Root>
            <UserName>{item.user?.name}</UserName>
          </HeaderLeft>
          <HeaderRight>
            {item.user?.proposer_level?.address?.eupmyundong} · LV.
            {item.user?.proposer_level?.level}
          </HeaderRight>
        </HeaderRow>

        <InfoSection>
          <InfoBlock>
            <InfoTitle>희망 운영 시간</InfoTitle>
            <InfoValue>
              {item.business_hours?.start} - {item.business_hours?.end}
            </InfoValue>
          </InfoBlock>
          <InfoBlock>
            <InfoTitle>희망 장소</InfoTitle>
            <InfoValue>
              {item.address?.eupmyundong}, {item.address?.road_detail} +{' '}
              {item.radius}
            </InfoValue>
          </InfoBlock>
        </InfoSection>

        <FooterRow>
          <StatsBar onClick={stop} onMouseDown={stop} onPointerDown={stop}>
            <LikeButton checked={!!liked} onChange={onToggleLike} />
            <span>{item.likes_count + (liked ? 1 : 0)}</span>
            <ScrapButton checked={!!scrapped} onChange={onToggleScrap} />
            <span>{item.scraps_count + (scrapped ? 1 : 0)}</span>
          </StatsBar>
        </FooterRow>

        <LargeBtn>수락하기</LargeBtn>
      </LargeBody>
    </OverlayCard>
  );
};

export default BigCard;

const OverlayCard = styled.article`
  position: relative;
  width: 20rem;
  height: 32rem;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
  background: #fff;
  pointer-events: auto;
`;
const LargeBody = styled.div`
  padding: 16px;
  display: grid;
  gap: 10px;
`;
const Tag = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const LargeTitle = styled.h3`
  color: #27272a;
  text-align: center;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.875rem;
`;
const LargeDesc = styled.p`
  height: 6.25rem;
  color: #27272a;
  font-size: 0.875rem;
  line-height: 1.25rem;
  overflow: hidden;
  -webkit-line-clamp: 4;
  white-space: normal;
  word-break: break-word;
`;
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const UserName = styled.span`
  color: #27272a;
`;
const HeaderRight = styled.span`
  color: #27272a;
  font-size: 14px;
`;
const InfoSection = styled.div`
  display: grid;
  gap: 10px;
  padding: 14px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`;
const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const InfoTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #27272a;
`;
const InfoValue = styled.span`
  color: #27272a;
`;
const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const StatsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  color: #9ca3af;
  margin-top: 8px;
`;
const LargeBtn = styled.button`
  margin-top: 8px;
  width: 100%;
  height: 44px;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  font-weight: 700;
`;
const LikeButton = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 1rem;
  height: 1rem;
  background: url(${HeartDefault}) no-repeat center/contain;
  cursor: pointer;
  &:checked {
    background: url(${HeartPressed}) no-repeat center/contain;
  }
  &:disabled {
    background: url(${HeartDisabled}) no-repeat center/contain;
    cursor: not-allowed;
  }
`;
const ScrapButton = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 1rem;
  height: 1rem;
  background: url(${ScrapDefault}) no-repeat center/contain;
  cursor: pointer;
  &:checked {
    background: url(${ScrapPressed}) no-repeat center/contain;
  }
`;
