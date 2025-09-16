// src/utils/index.ts
import { Transaction } from "../types";

// Group by creator - generic utility
export const groupByCreator =
  <T>(key: keyof T) =>
  (array: T[]) =>
    array.reduce(
      (objectsByKeyValue, obj) => {
        const keyValue = obj[key] as string;
        return {
          ...objectsByKeyValue,
          [keyValue]: (objectsByKeyValue[keyValue] || []).concat(obj),
        };
      },
      {} as Record<string, T[]>,
    );

// Date utilities
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isThisMonth = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Currency utilities
export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} PLN`;
};

export const formatCurrencyShort = (amount: number): string => {
  return `${amount} PLN`;
};

// Transaction utilities
export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === "income"
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);
};

export const calculateIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((total, t) => total + t.amount, 0);
};

export const calculateExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((total, t) => total + t.amount, 0);
};

export const getTransactionsByMonth = (
  transactions: Transaction[],
  month: number,
  year: number,
): Transaction[] => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === month &&
      transactionDate.getFullYear() === year
    );
  });
};

export const getTransactionsByCategory = (
  transactions: Transaction[],
  category: string,
): Transaction[] => {
  return transactions.filter(
    (transaction) => transaction.category === category,
  );
};

// Category utilities
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    Health: "#e74c3c",
    Fun: "#2ecc71",
    Travel: "#f39c12",
    Food: "#3498db",
    Shopping: "#9b59b6",
    Transport: "#8b4513",
    Bills: "#e91e63",
    Other: "#34495e",
  };
  return colorMap[category] || "#34495e";
};

export const getCategoryLimit = (category: string): number => {
  const limitMap: Record<string, number> = {
    Health: 200,
    Fun: 100,
    Travel: 150,
    Food: 1000,
    Shopping: 75,
    Transport: 150,
    Bills: 600,
    Other: 200,
  };
  return limitMap[category] || 200;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

// Sort utilities
export const sortTransactionsByDate = (
  transactions: Transaction[],
): Transaction[] => {
  return [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

// Month utilities
export const getMonthName = (monthIndex: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex] || "Unknown";
};

export const getCurrentMonth = (): { month: number; year: number } => {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear(),
  };
};
