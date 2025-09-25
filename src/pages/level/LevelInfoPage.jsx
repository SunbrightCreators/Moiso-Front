import styled from 'styled-components';
import { TopNavigation } from '../../components/common/navigation';
import Lv1Icon from '../../assets/icons/lv1.svg';
import Lv2Icon from '../../assets/icons/lv2.svg';
import Lv3Icon from '../../assets/icons/lv3.svg';

const LevelInfoPage = () => {
  return (
    <Screen>
      <TopNavigation left='back' title='지역주민 레벨 안내' />
      <Page>
        <Section>
          <SectionTitle>레벨 리워드 안내</SectionTitle>
          <SectionDesc>
            지역주민 레벨이 높아질수록 달라지는 레벨 리워드를 확인해보세요.
          </SectionDesc>

          <CardList>
            <Card>
              <CardText>
                <LvLabel>LV. 1</LvLabel>
                <CardLine>전월 레벨이 1인 경우,</CardLine>
                <CardLine>크라우드 펀딩 1천원권 지급</CardLine>
              </CardText>
              <CardIcon aria-hidden>
                <img src={Lv1Icon} alt='' />
              </CardIcon>
            </Card>

            <Card>
              <CardText>
                <LvLabel>LV. 2</LvLabel>
                <CardLine>전월 레벨이 2인 경우,</CardLine>
                <CardLine>크라우드 펀딩 1천원권 지급</CardLine>
              </CardText>
              <CardIcon aria-hidden>
                <img src={Lv2Icon} alt='' />
              </CardIcon>
            </Card>

            <Card>
              <CardText>
                <LvLabel>LV. 3</LvLabel>
                <CardLine>전월 레벨이 3인 경우,</CardLine>
                <CardLine>크라우드 펀딩 3천원권 지급</CardLine>
              </CardText>
              <CardIcon aria-hidden>
                <img src={Lv3Icon} alt='' />
              </CardIcon>
            </Card>
          </CardList>
        </Section>

        {/* 섹션: 레벨 산정 기준 */}
        <Section>
          <LevelTitle>레벨 산정 기준</LevelTitle>
          <RuleList>
            <li>
              매월 1일에 직전 월의 누적 점수를 기준으로 레벨을 산정합니다.
            </li>
            <li>
              점수 산정은 시스템 사정에 따라 최대 24시간이 소요될 수 있습니다.
            </li>
            <li>종합 점수 내역은 당월 내역만 확인할 수 있습니다.</li>
            <li>
              점수 반영 항목과 가중치는 다음과 같습니다.
              <ul>
                <li>지역 방문 빈도(GPS 기반): 40%</li>
                <li>활동 기여도(제안·좋아요·펀딩 참여): 60%</li>
              </ul>
            </li>
            <li>
              각 항목은 주 단위로 갱신되며, 최대치는 아래와 같습니다.
              <ul>
                <li>방문 횟수: 7회(1일 1회 한정)</li>
                <li>체류 시간: 7일 합산 최대 20시간</li>
                <li>활동 기여도: 10회</li>
              </ul>
            </li>
            <li>
              종합 점수 산정식: (방문횟수/7 × 40) + (제안수/10 × 20) + (좋아요
              수/10 × 20) + (펀딩 참여 수/10 × 20)
            </li>
            <li>
              점수 구간에 따른 레벨 부여
              <ul>
                <li>0~29점: Lv. 1</li>
                <li>30~59점: Lv. 2</li>
                <li>60~100점: Lv. 3</li>
              </ul>
            </li>
            <li>차후 레벨별 산정 기준 및 혜택은 변경될 수 있습니다.</li>
          </RuleList>
        </Section>
      </Page>
    </Screen>
  );
};

export default LevelInfoPage;

/* ====================== styled-components ====================== */
const Screen = styled.div`
  position: relative;
  width: 100%;
  min-height: 53.125rem;
  background: var(--colors-bg-subtle, #a1a1aa);
  display: flex;
  flex-direction: column;
`;
const Page = styled.main`
  min-height: 100%;
  opacity: 0.99;
  background: var(--colors-bg-subtle, #a1a1aa);
  padding: 0 1rem;
`;

const Section = styled.section`
  padding-top: 1.25rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.375rem;
  color: var(--colors-text-default, #27272a);

  /* sm/semibold */
  font: var(--text-sm-semibold);
`;

const SectionDesc = styled.p`
  margin: 0 0 0.75rem;
  color: var(--colors-text-subtle, #a1a1aa);

  /* xs/normal */
  font: var(--text-xs-normal);
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;

  border-radius: 0.5rem;
  background: #fff;
`;

const CardText = styled.div`
  display: grid;
  gap: 0.125rem;
`;

const LvLabel = styled.div`
  color: var(--colors-text-default, #27272a);

  /* sm/semibold */
  font: var(--text-sm-semibold);
`;

const CardLine = styled.p`
  color: var(--colors-text-muted, #52525b);
  /* sm/normal */
  font: var(--text-sm-normal);
`;

const CardIcon = styled.div`
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  background: #fff7d1;
  border: 1px solid #fde68a;

  span {
    font-size: 1.5rem;
    line-height: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const LevelTitle = styled.div`
  color: var(--colors-text-subtle, #a1a1aa);
  /* sm/normal */
  font: var(--text-xs-semibold);

  margin-bottom: 1.5rem;
`;
const RuleList = styled.ul`
  color: var(--colors-text-subtle, #6b7280);

  /* xs/normal */
  font: var(--text-xs-normal);

  margin: 0;
  padding-left: 1rem;
  list-style: disc;

  /* 1단계 항목 간격 */
  & > li {
    margin: 0;
  }
  & > li + li {
    margin-top: 0.375rem;
  } /* ≈6px */

  & ::marker {
    color: #a1a1aa;
  }

  /* 2단계 목록 */
  & ul {
    margin: 0.25rem 0 0;
    padding-left: 1rem;
    list-style: none;
    color: #a1a1aa;
  }
  & ul li {
    position: relative;
    padding-left: 10px;
  }
  & ul li + li {
    margin-top: 0.25rem;
  }
  & ul li::before {
    content: '–';
    position: absolute;
    left: 0;
    top: 0;
  }
`;
