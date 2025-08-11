import { Button, Dialog, Portal, CloseButton } from "@chakra-ui/react";

const DialogComponent = ({ isOpen, onClose, title, content, actionText = "확인", onAction }) => (
  <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {content}
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={onAction}>{actionText}</Button>
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
