import { UserType } from '@/types/data-types';
import create from 'zustand';

interface StoreState {
  userInfoIsExpand: boolean;
  switchExpand: () => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
  uid: string;
  setUid: (uid: string) => void;
}
export const useStore = create<StoreState>(set => ({
  userInfoIsExpand: false,
  switchExpand: () => {
    set(state => ({
      userInfoIsExpand: !state.userInfoIsExpand
    }));
  },
  userType: 'TOURIST',
  setUserType: (type: UserType) => {
    set(() => ({
      userType: type
    }));
  },
  uid: '',
  setUid: (uid: string) => {
    set(() => ({
      uid
    }));
  }
}));
