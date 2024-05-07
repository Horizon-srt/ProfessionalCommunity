import create from 'zustand';

interface StoreState {
  userInfoIsExpand: boolean;
  switchExpand: () => void;
}
export const useStore = create<StoreState>(set => ({
  userInfoIsExpand: false,
  switchExpand: () => {
    set(state => ({
      userInfoIsExpand: !state.userInfoIsExpand
    }));
  }
}));
