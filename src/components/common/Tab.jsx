import { useState } from 'react';
import styled from 'styled-components';

const Tab = ({ tabList = [], initialTab = 0, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <SLayout>
      <STabContainer>
        {tabList.map((tab, index) => (
          <STabBtn
            key={index}
            $isActive={activeTab === index}
            onClick={() => handleTabClick(index)}
          >
            {tab}
            {activeTab === index && <SIndicator />}
          </STabBtn>
        ))}
      </STabContainer>
    </SLayout>
  );
};

const SLayout = styled.div`
  display: flex;
  width: 100%;
`;

const STabContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  background-color: transparent;
  border-bottom: 0.0625rem solid #e0e0e0;
`;

const STabBtn = styled.button`
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  padding: 0.75rem 1rem;
  background-color: transparent;
  border: none;
  color: ${({ $isActive }) => ($isActive ? '#000000' : '#a0a0a0')};
  font-size: 0.875rem;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const SIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.125rem;
  background-color: #000000;
  animation: slideIn 0.2s ease;

  @keyframes slideIn {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
`;

export default Tab;
