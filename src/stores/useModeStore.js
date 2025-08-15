import { create } from 'zustand';

const MODE_KEY = 'userMode'; // 로컬스토리지 키 이름

const useUserModeStore = create((set) => ({
  userMode: localStorage.getItem(MODE_KEY) || null,

  // 상태 변경 함수 + localStorage 동기화
  setUserMode: (mode) => {
    if (mode) {
      localStorage.setItem(MODE_KEY, mode);
    } else {
      localStorage.removeItem(MODE_KEY);
    }
    set({ userMode: mode });
  },
}));

export default useUserModeStore;
