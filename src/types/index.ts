export interface Transaction {
  id: string;
  date: Date;
  category: string;
  title: string;
  amount: number;
  type: "expense" | "income";
}

export interface Category {
  id: number;
  name: string;
  currentVal: number;
  limit: number;
  color: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AuthState {
  isLoading: boolean;
  isSignOut: boolean;
  user: User | null;
}

export interface TransactionState {
  transactions: Transaction[];
}

export interface RootState {
  transactions: TransactionState;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AppTabParamList = {
  Reports: undefined;
  Transactions: undefined;
  Settings: undefined;
};

export type TransactionsStackParamList = {
  TransactionsList: undefined;
  TransactionDetails: {
    transaction?: Transaction;
    title: string;
    type: "add" | "update";
  };
};

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface TransactionForm {
  title: string;
  amount: string;
  category: string;
  date: Date;
  type: "expense" | "income";
}
