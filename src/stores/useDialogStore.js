import { create } from 'zustand';

const useDialogStore = create((set) => ({
  isOpen: false,
  title: '',
  content: '',
  actionText: '확인',
  showCancelButton: false, // 취소 버튼 표시 여부
  onAction: null,
  onCancel: null,
  setDialogOpen: (isOpen) => set({ isOpen }),
  
  // 확인 버튼만 있는 다이얼로그
  setAlertDialog: ({ title, content, actionText = '확인', onAction }) => 
    set({ 
      title, 
      content, 
      actionText, 
      onAction,
      showCancelButton: false,
      onCancel: null,
      isOpen: true 
    }),
  
  // 확인/취소 버튼이 있는 다이얼로그
  
  setConfirmDialog: ({ title, content, actionText = '확인', onAction, onCancel }) => 
    set({ 
      title, 
      content, 
      actionText, 
      onAction,
      showCancelButton: true,
      onCancel: onCancel || (() => set({ isOpen: false })),
      isOpen: true 
    }),
  
  closeDialog: () => set({ 
    isOpen: false, 
    title: '', 
    content: '', 
    actionText: '확인', 
    showCancelButton: false,
    onAction: null,
    onCancel: null
  }),
}));

export default useDialogStore;