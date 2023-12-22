import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserInfo = {
  email: string;
  password: string;
  token: string;
};

export type UserStore = UserInfo & {
  saveUserInfo(userInfo: Partial<UserInfo>): void;
};

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      email: "",
      password: "",
      token: "",
      saveUserInfo: (userinfo) => set(userinfo),
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
