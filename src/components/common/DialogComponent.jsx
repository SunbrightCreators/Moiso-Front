import React from 'react';
import { Button, Dialog, Portal, CloseButton } from '@chakra-ui/react';
import styled from 'styled-components';
import useDialogStore from '../../stores/useDialogStore';

const SContent = styled.div`
  white-space: pre-line;
`;

const DialogComponent = () => {
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
              {showCancelButton && (
                <Button onClick={handleCancel} variant="outline">
                  취소
                </Button>
              )}
              <Button onClick={handleAction} colorScheme="blue">
                {actionText}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default DialogComponent;