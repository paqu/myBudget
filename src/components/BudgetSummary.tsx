import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../config/colors";
import { formatCurrencyShort } from "../utils";

interface BudgetSummaryProps {
  income: number;
  expenses: number;
  balance: number;
}

export default function BudgetSummary({
  income,
  expenses,
  balance,
}: BudgetSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>Income</Text>
        <Text style={[styles.value, styles.income]}>
          +{formatCurrencyShort(income)}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.item}>
        <Text style={styles.label}>Expenses</Text>
        <Text style={[styles.value, styles.expense]}>
          -{formatCurrencyShort(expenses)}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.item}>
        <Text style={styles.label}>Balance</Text>
        <Text
          style={[styles.value, balance >= 0 ? styles.income : styles.expense]}
        >
          {balance >= 0 ? "+" : ""}
          {formatCurrencyShort(balance)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.GRAY,
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
  },
  income: {
    color: colors.GREEN,
  },
  expense: {
    color: colors.TORCH_RED,
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
});
