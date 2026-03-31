import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';

// Custom storage for Zustand that uses Expo SecureStore for native and localStorage for web
const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(name);
    }
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(name, value);
      return;
    }
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(name);
      return;
    }
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('SecureStore deleteItem error:', error);
    }
  },
};

interface AuthState {
  token: string | null;       // Access token → sent to backend
  idToken: string | null;     // ID token → decode for user info
  user: {
    email: string;
    name: string;
  } | null;
  initialized: boolean;
  isConnected: boolean;
}

interface AuthActions {
  signIn: (token: string, user: AuthState['user'], idToken?: string | null) => void;
  signOut: () => void;
  setInitialized: (initialized: boolean) => void;
  setConnected: (isConnected: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      idToken: null,
      user: null,
      initialized: false,
      isConnected: false,

      signIn: (token, user, idToken = null) => set({ token, idToken, user }),
      signOut: () => set({ token: null, idToken: null, user: null }),
      setInitialized: (initialized) => set({ initialized }),
      setConnected: (isConnected) => set({ isConnected }),
    }),
    {
      name: 'vanguard-auth-storage',
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setInitialized(true);
      },
    }
  )
);
