import styled from 'styled-components';
import { ReactComponent as Loading } from '../../assets/icons/loading.svg';

const SSpinnerComponent = () => {
  return <SSpinnerIcon />;
};

export default SSpinnerComponent;

const SSpinnerIcon = styled(Loading)`
  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  animation: spin 1.5s ease infinite;
`;
