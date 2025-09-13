import styled from 'styled-components';
import { Badge, Avatar } from '@chakra-ui/react';
import HeartDefault from '../../../assets/icons/heart_default.svg';
import HeartPressed from '../../../assets/icons/heart_pressed.svg';
import HeartDisabled from '../../../assets/icons/heart_disabled.svg';
import ScrapDefault from '../../../assets/icons/scrap_default.svg';
import ScrapPressed from '../../../assets/icons/scrap_pressed.svg';

const SmallCard = ({ item, liked, scrapped, onToggleLike, onToggleScrap }) => {
  return (
    <Card>
      <SImg src={Array.isArray(item.image) ? item.image[0] : item.image} />
      <Body>
        <TagRow>
          <Badge
            variant='subtle'
            size='md'
            bg='#F4F4F5'
            color='#27272A'
            borderRadius='999px'
            fontSize='12px'
            fontWeight='400'
          >
            {item.industry}
          </Badge>
        </TagRow>
        <HeadBox>
          <HeadTitle>{item.title}</HeadTitle>
          <HeadDesc>{item.subtitle}</HeadDesc>
        </HeadBox>

        <MetaList>
          <MetaLine>
            <MetaLabel>희망시간</MetaLabel>
            <MetaValue>
              {item.business_hours?.start} - {item.business_hours?.end}
            </MetaValue>
          </MetaLine>
          <MetaLine>
            <MetaLabel>희망장소</MetaLabel>
            <MetaValue>
              {item.address?.eupmyundong}, {item.address?.road_detail} +{' '}
              {item.radius}
            </MetaValue>
          </MetaLine>
        </MetaList>

        <FooterRow>
          <UserRow>
            <Avatar.Root shape='full' size='xs'>
              <Avatar.Fallback
                name={item.user?.name}
                src={item.user?.profile_image}
              />
            </Avatar.Root>
            <UserName>{item.user?.name}</UserName>
          </UserRow>
          <StatsRow onClick={stop} onMouseDown={stop} onPointerDown={stop}>
            <LikeButton checked={!!liked} onChange={onToggleLike} />
            <span>{item.likes_count + (liked ? 1 : 0)}</span>
            <ScrapButton checked={!!scrapped} onChange={onToggleScrap} />
            <span>{item.scraps_count + (scrapped ? 1 : 0)}</span>
          </StatsRow>
        </FooterRow>
      </Body>
    </Card>
  );
};

export default SmallCard;

/* styled-components */
const Card = styled.article`
  background: transparent;
  width: 20.375rem;
`;
const SImg = styled.img`
  width: 20.375rem;
  height: 11.375rem;
  border-radius: 16px;
  background: #e5e7eb url(${(p) => p.src}) center/cover no-repeat;
`;
const Body = styled.div`
  padding: 12px 2px 24px;
  display: grid;
  gap: 8px;
`;
const TagRow = styled.div`
  width: 100%;
  margin-top: 6px;
  display: flex;
`;
const HeadBox = styled.div`
  display: grid;
  gap: 4px;
`;
const HeadTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
`;
const HeadDesc = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.45;
  -webkit-line-clamp: 1;
`;
const MetaList = styled.div`
  margin-top: 6px;
  display: grid;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
`;
const MetaLine = styled.div`
  display: flex;
  gap: 8px;
`;
const MetaLabel = styled.span`
  min-width: 60px;
`;
const MetaValue = styled.span`
  color: #6b7280;
`;
const FooterRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
`;
const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const UserName = styled.span`
  color: #27272a;
`;
const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  color: #9ca3af;
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
