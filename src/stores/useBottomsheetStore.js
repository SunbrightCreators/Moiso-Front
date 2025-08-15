import { create } from 'zustand';

const useBottomsheetStore = create((set) => ({
  // 모달 바텀시트 상태
  isModalBottomsheetOpen: false,
  modalBottomsheetChildren: null,

  // 모달 바텀시트 액션
  setModalBottomsheetOpen: (isOpen) =>
    set((state) => ({
      ...state,
      isModalBottomsheetOpen: isOpen,
    })),

  setModalBottomsheetChildren: (children) =>
    set((state) => ({
      ...state,
      modalBottomsheetChildren: children,
    })),

  openModalBottomsheet: (children, level = 2) =>
    set((state) => ({
      ...state,
      isModalBottomsheetOpen: true,
      modalBottomsheetChildren: children,
    })),

  closeModalBottomsheet: () =>
    set((state) => ({
      ...state,
      isModalBottomsheetOpen: false,
      modalBottomsheetChildren: null,
    })),
}));

export default useBottomsheetStore;
