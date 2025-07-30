import { create } from 'zustand';

const useUserStore = create((set) => ({
  name: '',
  setName: (name) => set({ name }),
}));

export default useUserStore;
