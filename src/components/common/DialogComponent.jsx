import React from 'react';
<<<<<<< Updated upstream
import { Button, Dialog, Portal, CloseButton } from '@chakra-ui/react';
import styled from 'styled-components';
import useDialogStore from '../../stores/useDialogStore';

const SContent = styled.div`
  white-space: pre-line;
`;

const DialogComponent = () => {
=======
import { Button, Dialog as ChakraDialog, Portal, CloseButton } from '@chakra-ui/react';
import useDialogStore from '../../stores/useDialogStore';

const Dialog = () => {
>>>>>>> Stashed changes
  const {
    isOpen,
    title,
    content,
    actionText,
    showCancelButton,
    onAction,
    onCancel,
<<<<<<< Updated upstream
    closeDialog,
=======
    closeDialog
>>>>>>> Stashed changes
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
    if (onCancel) {
      onCancel();
    } else {
      handleClose();
    }
  };

  return (
<<<<<<< Updated upstream
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxWidth="400px">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <SContent>{content}</SContent>
            </Dialog.Body>
            <Dialog.Footer gap={2} justifyContent="flex-end">
=======
    <ChakraDialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content maxWidth="400px">
            <ChakraDialog.Header>
              <ChakraDialog.Title>{title}</ChakraDialog.Title>
            </ChakraDialog.Header>
            <ChakraDialog.Body>
              <div style={{ whiteSpace: 'pre-line' }}>{content}</div>
            </ChakraDialog.Body>
            <ChakraDialog.Footer gap={2} justifyContent="flex-end">
>>>>>>> Stashed changes
              {showCancelButton && (
                <Button onClick={handleCancel} variant="outline">
                  취소
                </Button>
              )}
              <Button onClick={handleAction} colorScheme="blue">
                {actionText}
              </Button>
<<<<<<< Updated upstream
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
=======
            </ChakraDialog.Footer>
            <ChakraDialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </ChakraDialog.CloseTrigger>
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
>>>>>>> Stashed changes
  );
};

export default Dialog;