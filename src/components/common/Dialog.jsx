import React from 'react';
import {
  Button,
  Dialog as ChakraDialog,
  Portal,
  CloseButton,
} from '@chakra-ui/react';
import useDialogStore from '../../stores/useDialogStore';

const Dialog = () => {
  const {
    isOpen,
    title,
    content,
    actionText,
    showCancelButton,
    onAction,
    closeDialog,
  } = useDialogStore();

  const handleClose = () => {
    closeDialog();
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    handleClose();
  };

  const handleCancel = () => {
    handleClose(); // 수정 (단순히 닫는 걸로)
  };

  return (
    <ChakraDialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && handleClose()}
    >
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content maxWidth='400px'>
            <ChakraDialog.Header>
              <ChakraDialog.Title>{title}</ChakraDialog.Title>
            </ChakraDialog.Header>
            <ChakraDialog.Body>
              <div style={{ whiteSpace: 'pre-line' }}>{content}</div>
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

export default Dialog;
