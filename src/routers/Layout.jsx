import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import {
  TopNavigation,
  BottomNavigation,
} from '../components/common/navigation';

const TNLayout = () => (
  <ColumnLayout>
    <TopNavigation />
    <Outlet />
  </ColumnLayout>
);

const BNLayout = () => (
  <ColumnLayout>
    <Outlet />
    <BottomNavigation />
  </ColumnLayout>
);

const TNnBNLayout = () => (
  <ColumnLayout>
    <TopNavigation />
    <Outlet />
    <BottomNavigation />
  </ColumnLayout>
);

const TNnBBLayout = () => (
  <ColumnLayout>
    <TopNavigation />
    <Outlet />
    {/* 추가해야 함 */}
  </ColumnLayout>
);

const TBBLayout = () => (
  <>
    {/* 추가해야 함 */}
    <Outlet />
  </>
);

const ColumnLayout = styled.div`
  display: flex;
  flex-flow: column nowrap;

  width: inherit;
  height: inherit;
`;

export { TNLayout, BNLayout, TNnBNLayout, TNnBBLayout, TBBLayout };
