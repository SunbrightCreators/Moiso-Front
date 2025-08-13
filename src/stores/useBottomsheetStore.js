import { create } from 'zustand';

export const useBottomsheetStore = create((set) => ({
  // '지도 탐색용 바텀시트 (non-modal)
  isMapBottomsheetOpen: false,
  mapBottomsheetLevel: 1, // 1, 2, 3단
  mapBottomsheetChildren: null,

  // 모달 바텀시트
  isModalBottomsheetOpen: false,
  modalBottomsheetLevel: 2, // 2, 3단
  modalBottomsheetChildren: null,

  // 지도 탐색용 바텀시트 (non-modal) 액션
  openMapBottomsheet: (children, level = 2) => set({
    isMapBottomsheetOpen: true,
    mapBottomsheetChildren: children,
    mapBottomsheetLevel: level
  }),
  closeMapBottomsheet: () => set({
    isMapBottomsheetOpen: false,
    mapBottomsheetChildren: null,
    mapBottomsheetLevel: 1
  }),
  setMapBottomsheetLevel: (level) => set({ mapBottomsheetLevel: level }),

  // 모달 바텀시트 액션
  openModalBottomsheet: (children, level = 2) => set({
    isModalBottomsheetOpen: true,
    modalBottomsheetChildren: children,
    modalBottomsheetLevel: level
  }),
  closeModalBottomsheet: () => set({
    isModalBottomsheetOpen: false,
    modalBottomsheetChildren: null,
    modalBottomsheetLevel: 2
  }),
  setModalBottomsheetLevel: (level) => set({ modalBottomsheetLevel: level }),
}));