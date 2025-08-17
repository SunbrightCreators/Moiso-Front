import { create } from 'zustand';

const useBottomsheetStore = create((set) => ({
  // 바텀시트 상태
  isOpen: false,
  transition: 'close',
  children: null,

  open: (children) => {
    // 스크롤 금지
    document.body.style.overflow = 'hidden';

    // 1. 컴포넌트를 먼저 마운트
    set((state) => ({
      ...state,
      isOpen: true,
      children: children,
    }));

    // 2. 마운트되는 동안 기다리고
    setTimeout(() => {
      // 3. 트랜지션을 'open'으로 변경
      set((state) => ({
        ...state,
        transition: 'open',
      }));
    }, 30);
  },

  close: () => {
    // 1. 트랜지션을 'close'로 변경
    set((state) => ({
      ...state,
      transition: 'close',
    }));

    // 2. 애니메이션이 끝난 후 언마운트
    setTimeout(() => {
      // 스크롤 금지 해제
      document.body.style.overflow = '';

      set((state) => ({
        ...state,
        isOpen: false,
        children: null,
      }));
    }, 300); // transition 시간과 맞춤
  },
}));

export default useBottomsheetStore;
