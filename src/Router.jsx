import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpinnerComponent from './components/common/SpinnerComponent';
import { Flex, Spacer, Box, Button, Text, Input } from '@chakra-ui/react';
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Box p={6} bg='gray.50' textAlign='center'>
              <Text fontSize='2xl' color='primary'>
                Chakra 테스트
              </Text>
              <Input
                data-testid='test-input'
                placeholder='값을 입력하세요'
                mt={4}
              />
              <Button colorPalette='blue'>클릭해보세요</Button>
              <Flex>
                <Button bg='red'>Box 1</Button>
                <Spacer />
                <Button bg='red'>Box ２</Button>
              </Flex>
            </Box>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
