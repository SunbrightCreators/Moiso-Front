'use client';

import { ChakraProvider } from '@chakra-ui/react';
import system from '../theme';

function Provider(props) {
  return <ChakraProvider value={system}>{props.children}</ChakraProvider>;
};

export default Provider;
