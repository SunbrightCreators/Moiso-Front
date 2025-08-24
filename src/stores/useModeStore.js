import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useModeStore = create(
  persist(
    (set, get) => ({
      // 기본값: 제안자 모드
      isProposerMode: true,

      // 상태 변경 함수들
      setIsProposerMode: (v) => set({ isProposerMode: v }),
      toggleMode: () => set({ isProposerMode: !get().isProposerMode }),
    }),
    {
      // localStorage에 저장될 키 이름
      name: 'isProposerMode-storage',
    },
  ),
);

export default useModeStore;
