// src/context/AuthProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
import firebaseService from "../services/firebase";

interface AuthState {
  isLoading: boolean;
  isSignOut: boolean;
  user: User | null;
}

type AuthAction =
  | { type: "RESTORE_USER"; user: User | null }
  | { type: "SIGN_IN"; user: User }
  | { type: "SIGN_OUT" }
  | { type: "SET_LOADING"; loading: boolean };

interface AuthContextType {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialAuthState: AuthState = {
  isLoading: true,
  isSignOut: false,
  user: null,
};

function authReducer(prevState: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORE_USER":
      return {
        ...prevState,
        user: action.user,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignOut: false,
        user: action.user,
        isLoading: false,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignOut: true,
        user: null,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...prevState,
        isLoading: action.loading,
      };
    default:
      return prevState;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = firebaseService.onAuthStateChanged((user) => {
      dispatch({ type: "RESTORE_USER", user });
    });

    // Restore user from AsyncStorage
    const restoreUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          // Note: This is just for restoration, Firebase auth state will override
          dispatch({ type: "RESTORE_USER", user });
        }
      } catch (error) {
        console.error("Error restoring user:", error);
        dispatch({ type: "RESTORE_USER", user: null });
      }
    };

    restoreUser();

    return unsubscribe;
  }, []);

  const authActions = {
    signIn: async (email: string, password: string) => {
      try {
        dispatch({ type: "SET_LOADING", loading: true });
        const { user } = await firebaseService.signIn(email, password);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "SIGN_IN", user });
      } catch (error) {
        dispatch({ type: "SET_LOADING", loading: false });
        throw error;
      }
    },

    signUp: async (email: string, password: string) => {
      try {
        dispatch({ type: "SET_LOADING", loading: true });
        const { user } = await firebaseService.signUp(email, password);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "SIGN_IN", user });
      } catch (error) {
        dispatch({ type: "SET_LOADING", loading: false });
        throw error;
      }
    },

    signOut: async () => {
      try {
        await firebaseService.signOut();
        await AsyncStorage.removeItem("user");
        dispatch({ type: "SIGN_OUT" });
      } catch (error) {
        console.error("Sign out error:", error);
        throw error;
      }
    },
  };

  const value = {
    authState,
    ...authActions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for checking if user is authenticated
export function useIsAuthenticated(): boolean {
  const { authState } = useAuth();
  return !!authState.user && !authState.isSignOut;
}
