// src/screens/ReportsScreen.tsx
import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { colors } from "../config/colors";
import { useAppSelector } from "../store/hooks";
import {
  getCurrentMonth,
  getMonthName,
  getTransactionsByMonth,
  calculateIncome,
  calculateExpenses,
  calculateBalance,
  groupByCreator,
} from "../utils";
import { CATEGORIES } from "../config/constants";
import { Transaction } from "../types";

import BudgetSummary from "../components/BudgetSummary";
import CategoriesList from "../components/CategoriesList";
import PeriodPicker from "../components/PeriodPicker";

export default function ReportsScreen() {
  const { transactions } = useAppSelector((state) => state.transactions);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const current = getCurrentMonth();
    return current.month;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const current = getCurrentMonth();
    return current.year;
  });

  // Filter transactions by selected month/year
  const monthTransactions = useMemo(() => {
    return getTransactionsByMonth(transactions, selectedMonth, selectedYear);
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate budget summary
  const budgetData = useMemo(() => {
    const income = calculateIncome(monthTransactions);
    const expenses = calculateExpenses(monthTransactions);
    const balance = calculateBalance(monthTransactions);

    return { income, expenses, balance };
  }, [monthTransactions]);

  // Calculate category spending
  const categoryData = useMemo(() => {
    const groupByCategory = groupByCreator<Transaction>("category");
    const expenseTransactions = monthTransactions.filter(
      (t) => t.type === "expense",
    );
    const grouped = groupByCategory(expenseTransactions);

    return CATEGORIES.map((category) => {
      const categoryTransactions = grouped[category.name] || [];
      const currentVal = categoryTransactions.reduce(
        (sum, t) => sum + t.amount,
        0,
      );

      return {
        ...category,
        currentVal,
      };
    });
  }, [monthTransactions]);

  const handlePeriodChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <PeriodPicker
            month={selectedMonth}
            year={selectedYear}
            onPeriodChange={handlePeriodChange}
          />
        </View>

        <View style={styles.card}>
          <BudgetSummary
            income={budgetData.income}
            expenses={budgetData.expenses}
            balance={budgetData.balance}
          />
        </View>

        <View style={styles.card}>
          <CategoriesList categories={categoryData} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: colors.WHITE,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.DARK,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
