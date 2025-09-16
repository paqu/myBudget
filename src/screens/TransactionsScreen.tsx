// src/screens/TransactionsScreen.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";

import { colors } from "../config/colors";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeTransaction } from "../store/transactionsSlice";
import {
  getCurrentMonth,
  getMonthName,
  sortTransactionsByDate,
} from "../utils";
import { Transaction, TransactionsStackParamList } from "../types";

type TransactionsScreenNavigationProp = StackNavigationProp<
  TransactionsStackParamList,
  "TransactionsList"
>;

// Simple PeriodPicker component
interface PeriodPickerProps {
  month: number;
  year: number;
  onPeriodChange: (month: number, year: number) => void;
}

function PeriodPicker({ month, year, onPeriodChange }: PeriodPickerProps) {
  const canGoForward = () => {
    const current = getCurrentMonth();
    return month < current.month || year < current.year;
  };

  const goToPrevious = () => {
    if (month === 0) {
      onPeriodChange(11, year - 1);
    } else {
      onPeriodChange(month - 1, year);
    }
  };

  const goToNext = () => {
    if (!canGoForward()) return;

    if (month === 11) {
      onPeriodChange(0, year + 1);
    } else {
      onPeriodChange(month + 1, year);
    }
  };

  return (
    <View style={periodStyles.container}>
      <TouchableOpacity onPress={goToPrevious} style={periodStyles.button}>
        <FontAwesome name="chevron-left" size={16} color={colors.GRAY} />
      </TouchableOpacity>

      <View style={periodStyles.dateContainer}>
        <Text style={periodStyles.dateText}>
          {getMonthName(month)}, {year}
        </Text>
      </View>

      <TouchableOpacity
        onPress={goToNext}
        style={[
          periodStyles.button,
          !canGoForward() && periodStyles.buttonDisabled,
        ]}
        disabled={!canGoForward()}
      >
        <FontAwesome
          name="chevron-right"
          size={16}
          color={canGoForward() ? colors.GRAY : colors.GRAY + "50"}
        />
      </TouchableOpacity>
    </View>
  );
}

const periodStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  button: {
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  dateContainer: {
    minWidth: 150,
    alignItems: "center",
    marginHorizontal: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.DARK,
  },
});

// Simple Transaction component
interface TransactionItemProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const { title, category, amount, type } = transaction;

  const getCategoryColor = (cat: string) => {
    const colors = {
      Health: "#e74c3c",
      Fun: "#2ecc71",
      Food: "#3498db",
      Bills: "#e91e63",
      Transport: "#8b4513",
    };
    return colors[cat as keyof typeof colors] || "#34495e";
  };

  return (
    <View style={transactionStyles.container}>
      <View
        style={[
          transactionStyles.categoryIndicator,
          { backgroundColor: getCategoryColor(category) },
        ]}
      />

      <View style={transactionStyles.content}>
        <Text style={transactionStyles.title}>{title}</Text>
        <Text style={transactionStyles.category}>{category}</Text>
      </View>

      <Text
        style={[
          transactionStyles.amount,
          { color: type === "income" ? colors.GREEN : colors.TORCH_RED },
        ]}
      >
        {type === "income" ? "+" : "-"}
        {amount} PLN
      </Text>

      <View style={transactionStyles.actions}>
        <TouchableOpacity
          onPress={onEdit}
          style={transactionStyles.actionButton}
        >
          <FontAwesome name="edit" size={16} color={colors.GRAY} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          style={transactionStyles.actionButton}
        >
          <FontAwesome name="trash" size={16} color={colors.TORCH_RED} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const transactionStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.WHITE,
    marginVertical: 2,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.DARK,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: colors.GRAY,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 12,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default function TransactionsScreen() {
  const navigation = useNavigation<TransactionsScreenNavigationProp>();
  const dispatch = useAppDispatch();

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
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Sort transactions by date (newest first)
  const sortedTransactions = useMemo(() => {
    return sortTransactionsByDate(filteredTransactions);
  }, [filteredTransactions]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof sortedTransactions> = {};

    sortedTransactions.forEach((transaction) => {
      const dateKey = new Date(transaction.date).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return groups;
  }, [sortedTransactions]);

  const handlePeriodChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleAddTransaction = () => {
    navigation.navigate("TransactionDetails", {
      title: "New Transaction",
      type: "add",
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    navigation.navigate("TransactionDetails", {
      transaction,
      title: "Edit Transaction",
      type: "update",
    });
  };

  const handleDeleteTransaction = (transactionId: string, title: string) => {
    Alert.alert(
      "Delete Transaction",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch(removeTransaction(transactionId)),
        },
      ],
    );
  };

  const renderDateGroup = (dateKey: string, transactions: Transaction[]) => (
    <View key={dateKey} style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{dateKey}</Text>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={() => handleEditTransaction(transaction)}
          onDelete={() =>
            handleDeleteTransaction(transaction.id, transaction.title)
          }
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      <PeriodPicker
        month={selectedMonth}
        year={selectedYear}
        onPeriodChange={handlePeriodChange}
      />

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTransaction}
        >
          <FontAwesome name="plus" size={16} color={colors.WHITE} />
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(groupedTransactions).length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="inbox" size={48} color={colors.GRAY} />
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptySubtitle}>
              Add your first transaction to get started
            </Text>
          </View>
        ) : (
          Object.entries(groupedTransactions).map(([dateKey, transactions]) =>
            renderDateGroup(dateKey, transactions),
          )
        )}
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
  addButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.GREEN,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateGroup: {
    marginVertical: 8,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.GRAY,
    marginBottom: 8,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.GRAY,
    textAlign: "center",
  },
});
