import { create } from 'zustand';

const useDialogStore = create((set) => ({
  isOpen: false,
  title: '',
  content: '',
  actionText: '확인',
  onAction: null,
  setDialogOpen: (isOpen) => set({ isOpen }),
  setDialog: ({ title, content, actionText, onAction }) => 
    set({ title, content, actionText, onAction, isOpen: true }),
  closeDialog: () => set({ isOpen: false, title: '', content: '', actionText: '확인', onAction: null }),
}));

export default useDialogStore;