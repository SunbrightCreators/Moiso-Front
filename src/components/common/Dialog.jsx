import React from 'react';
import styled from 'styled-components';
import {
  Button,
  CloseButton,
  Dialog as ChakraDialog,
  Portal,
} from '@chakra-ui/react';
import useDialogStore from '../../stores/useDialogStore'; //

const Dialog = () => {
  const {
    isOpen,
    title,
    content,
    actionText,
    showCancelButton,
    onAction,
    onCancel,
    closeDialog,
  } = useDialogStore();

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    closeDialog();
  };

  const handleCancel = () => {
    closeDialog();
  };

  return (
    <ChakraDialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && closeDialog()}
    >
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content maxWidth='400px'>
            <ChakraDialog.Header>
              <ChakraDialog.Title>{title}</ChakraDialog.Title>
            </ChakraDialog.Header>
            <ChakraDialog.Body>
              <ContentDiv>{content}</ContentDiv>
            </ChakraDialog.Body>
            <ChakraDialog.Footer gap={2} justifyContent='flex-end'>
              {showCancelButton && (
                <Button onClick={handleCancel} variant='outline'>
                  취소
                </Button>
              )}
              <Button onClick={handleAction} colorScheme='blue'>
                {actionText}
              </Button>
            </ChakraDialog.Footer>
            <ChakraDialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </ChakraDialog.CloseTrigger>
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  );
};

// ———————————————————  styled-components ———————————————————

const ContentDiv = styled.div`
  white-space: pre-line;
`;

export default Dialog;
