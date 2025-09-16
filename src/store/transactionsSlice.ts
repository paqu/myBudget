import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "../types";

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [
    {
      id: "1",
      date: new Date(2024, 8, 13),
      category: "Fun",
      title: "Cinema",
      amount: 45,
      type: "expense",
    },
    {
      id: "2",
      date: new Date(2024, 8, 12),
      category: "Food",
      title: "Lunch",
      amount: 25,
      type: "expense",
    },
    {
      id: "3",
      date: new Date(2024, 8, 10),
      category: "Health",
      title: "Salary",
      amount: 3000,
      type: "income",
    },
  ],
  isLoading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, "id">>) => {
      const newTransaction: Transaction = {
        id: generateId(),
        ...action.payload,
      };
      state.transactions.unshift(newTransaction);
    },

    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(
        (transaction) => transaction.id === action.payload.id,
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },

    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload,
      );
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Helper function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const {
  addTransaction,
  updateTransaction,
  removeTransaction,
  setLoading,
  setError,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
