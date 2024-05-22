import { UserType } from '@/types/data-types';
import create from 'zustand';

interface StoreState {
  userInfoIsExpand: boolean;
  switchExpand: () => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
  uid: string;
  setUid: (uid: string) => void;
  avator: string;
  setAvator: (a: string) => void;
  userName: string;
  setUserName: (u: string) => void;
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
  },
  userName: '',
  setUserName: (u: string) => {
    set(() => ({
      userName: u
    }));
  },
  avator: '',
  setAvator(a) {
    set(() => ({
      avator: a
    }));
  }
}));
