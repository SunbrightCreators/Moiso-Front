import React from 'react';
import { Button, Dialog, Portal, CloseButton } from "@chakra-ui/react";

const DialogComponent = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  actionText = "확인", 
  showCancelButton = false,
  onAction,
  onCancel 
}) => (
  <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxWidth="400px">
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <div style={{ whiteSpace: 'pre-line' }}>{content}</div>
          </Dialog.Body>
          <Dialog.Footer gap={2} justifyContent="flex-end">
            {showCancelButton && (
              <Button onClick={onCancel || onClose} variant="outline">
                취소
              </Button>
            )}
            <Button onClick={onAction} colorScheme="blue">
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

export default DialogComponent;