import { create } from 'zustand';

export const useBottomsheetStore = create((set) => ({
  // 지도 탐색용 바텀시트 상태
  isMapBottomsheetOpen: false,
  mapBottomsheetLevel: 1, // 1, 2, 3단
  mapBottomsheetChildren: null,

  // 모달 바텀시트 상태
  isModalBottomsheetOpen: false,
  modalBottomsheetLevel: 2, // 2, 3단
  modalBottomsheetChildren: null,

  // 지도 탐색용 바텀시트 액션
  setMapBottomsheetOpen: (isOpen) =>
    set((state) => ({
      ...state,
      isMapBottomsheetOpen: isOpen,
    })),

  setMapBottomsheetLevel: (level) =>
    set((state) => ({
      ...state,
      mapBottomsheetLevel: Math.max(1, Math.min(3, level)),
    })),

  setMapBottomsheetChildren: (children) =>
    set((state) => ({
      ...state,
      mapBottomsheetChildren: children,
    })),

  openMapBottomsheet: (children, level = 2) =>
    set((state) => ({
      ...state,
      isMapBottomsheetOpen: true,
      mapBottomsheetChildren: children,
      mapBottomsheetLevel: Math.max(1, Math.min(3, level)),
    })),

  closeMapBottomsheet: () =>
    set((state) => ({
      ...state,
      isMapBottomsheetOpen: false,
      mapBottomsheetChildren: null,
      mapBottomsheetLevel: 1,
    })),

  // 모달 바텀시트 액션
  setModalBottomsheetOpen: (isOpen) =>
    set((state) => ({
      ...state,
      isModalBottomsheetOpen: isOpen,
    })),

  setModalBottomsheetLevel: (level) =>
    set((state) => ({
      ...state,
      modalBottomsheetLevel: Math.max(2, Math.min(3, level)),
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
      modalBottomsheetLevel: Math.max(2, Math.min(3, level)),
    })),

  closeModalBottomsheet: () =>
    set((state) => ({
      ...state,
      isModalBottomsheetOpen: false,
      modalBottomsheetChildren: null,
      modalBottomsheetLevel: 2,
    })),

  // 유틸리티 액션
  toggleMapBottomsheetLevel: () =>
    set((state) => {
      const currentLevel = state.mapBottomsheetLevel;
      const newLevel = currentLevel === 3 ? 1 : currentLevel + 1;
      return {
        ...state,
        mapBottomsheetLevel: newLevel,
      };
    }),

  toggleModalBottomsheetLevel: () =>
    set((state) => {
      const currentLevel = state.modalBottomsheetLevel;
      const newLevel = currentLevel === 3 ? 2 : 3;
      return {
        ...state,
        modalBottomsheetLevel: newLevel,
      };
    }),
}));
