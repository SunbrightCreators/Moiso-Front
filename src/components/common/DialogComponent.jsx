import { Dialog, DialogContent,DialogHeader,DialogBody,DialogFooter,DialogBackdrop,DialogCloseTrigger,Button,DialogTitle
} from "@chakra-ui/react";

const DialogComponent = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(e) => onClose(!e.open)}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />
        
        <DialogBody>
          Dialog에 보일 내용/Dialog에 보일 내용/Dialog에 보일 내용/Dialog에 보일 내용/Dialog에 보일 내용/여러 줄 나오게/
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
