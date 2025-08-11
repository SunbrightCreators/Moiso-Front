import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogBody, 
  DialogFooter,
  DialogBackdrop,
  DialogCloseTrigger,
  Button,
  DialogTitle
} from "@chakra-ui/react";

const DialogComponent = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(e) => onClose(!e.open)}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title 영역</DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />
        
        <DialogBody>
          Dialog 내용입니다.Dialog 내용입니다.Dialog 내용입니다.Dialog 내용입니다.
        </DialogBody>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="blue">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;