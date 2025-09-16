// src/screens/TransactionDetailsScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";

import FormTextInput from "../components/FormTextInput";
import FormButton from "../components/FormButton";
import { colors } from "../config/colors";
import { useAppDispatch } from "../store/hooks";
import { addTransaction, updateTransaction } from "../store/transactionsSlice";
import { validateAmount, formatDateShort } from "../utils";
import { CATEGORY_NAMES } from "../config/constants";
import { TransactionsStackParamList, Transaction } from "../types";

type TransactionDetailsRouteProp = RouteProp<
  TransactionsStackParamList,
  "TransactionDetails"
>;
type TransactionDetailsNavigationProp = StackNavigationProp<
  TransactionsStackParamList,
  "TransactionDetails"
>;

interface FormData {
  title: string;
  amount: string;
  category: string;
  date: Date;
  type: "expense" | "income";
}

interface CategoryPickerProps {
  visible: boolean;
  selectedCategory: string;
  onSelect: (category: string) => void;
  onClose: () => void;
}

function CategoryPicker({
  visible,
  selectedCategory,
  onSelect,
  onClose,
}: CategoryPickerProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.container}>
          <View style={pickerStyles.header}>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={24} color={colors.GRAY} />
            </TouchableOpacity>
            <Text style={pickerStyles.title}>Select Category</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={pickerStyles.list}>
            {CATEGORY_NAMES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  pickerStyles.item,
                  selectedCategory === category && pickerStyles.selectedItem,
                ]}
                onPress={() => {
                  onSelect(category);
                  onClose();
                }}
              >
                <Text
                  style={[
                    pickerStyles.itemText,
                    selectedCategory === category &&
                      pickerStyles.selectedItemText,
                  ]}
                >
                  {category}
                </Text>
                {selectedCategory === category && (
                  <FontAwesome name="check" size={16} color={colors.GREEN} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.DARK,
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedItem: {
    backgroundColor: "#f8f9fa",
  },
  itemText: {
    fontSize: 16,
    color: colors.DARK,
  },
  selectedItemText: {
    color: colors.GREEN,
    fontWeight: "500",
  },
});

export default function TransactionDetailsScreen() {
  const navigation = useNavigation<TransactionDetailsNavigationProp>();
  const route = useRoute<TransactionDetailsRouteProp>();
  const dispatch = useAppDispatch();

  const { transaction, title, type } = route.params;
  const isEditing = type === "update";

  const [formData, setFormData] = useState<FormData>(() => {
    if (isEditing && transaction) {
      return {
        title: transaction.title,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: new Date(transaction.date),
        type: transaction.type,
      };
    }
    return {
      title: "",
      amount: "",
      category: CATEGORY_NAMES[0],
      date: new Date(),
      type: "expense",
    };
  });

  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
  }>({});

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const amountInputRef = useRef<TextInput>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: title,
      headerBackTitle: "Back",
    });
  }, [navigation, title]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (!validateAmount(formData.amount)) {
      newErrors.amount = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof FormData) => (value: string | Date) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (typeof value === "string" && errors[field as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleTypeToggle = (newType: "expense" | "income") => {
    setFormData((prev) => ({ ...prev, type: newType }));
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const transactionData = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      type: formData.type,
    };

    try {
      if (isEditing && transaction) {
        dispatch(
          updateTransaction({
            id: transaction.id,
            ...transactionData,
          }),
        );
        Alert.alert("Success", "Transaction updated successfully");
      } else {
        dispatch(addTransaction(transactionData));
        Alert.alert("Success", "Transaction added successfully");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save transaction");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Transaction Type Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === "expense" && styles.typeButtonActive,
              ]}
              onPress={() => handleTypeToggle("expense")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === "expense" && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === "income" && styles.typeButtonActive,
              ]}
              onPress={() => handleTypeToggle("income")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === "income" && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={styles.categorySelectorText}>{formData.category}</Text>
            <FontAwesome name="chevron-down" size={16} color={colors.GRAY} />
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <FormTextInput
            title="Title"
            value={formData.title}
            onChangeText={handleInputChange("title")}
            placeholder="Enter transaction title"
            returnKeyType="next"
            onSubmitEditing={() => amountInputRef.current?.focus()}
            error={errors.title}
          />
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <FormTextInput
            ref={amountInputRef}
            title="Amount (PLN)"
            value={formData.amount}
            onChangeText={handleInputChange("amount")}
            placeholder="0.00"
            keyboardType="numeric"
            returnKeyType="done"
            error={errors.amount}
          />
        </View>

        {/* Date Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <View style={styles.dateContainer}>
            <FontAwesome name="calendar" size={16} color={colors.GRAY} />
            <Text style={styles.dateText}>
              {formatDateShort(formData.date)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <FormButton
            label={isEditing ? "Update Transaction" : "Add Transaction"}
            onPress={handleSave}
            disabled={!formData.title || !formData.amount}
          />

          <FormButton
            label="Cancel"
            onPress={handleCancel}
            variant="secondary"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>

      <CategoryPicker
        visible={showCategoryPicker}
        selectedCategory={formData.category}
        onSelect={(category) => setFormData((prev) => ({ ...prev, category }))}
        onClose={() => setShowCategoryPicker(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.DARK,
    marginBottom: 12,
  },
  typeToggle: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: colors.GREEN,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.GRAY,
  },
  typeButtonTextActive: {
    color: colors.WHITE,
  },
  categorySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: colors.WHITE,
  },
  categorySelectorText: {
    fontSize: 16,
    color: colors.DARK,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  dateText: {
    fontSize: 16,
    color: colors.DARK,
    marginLeft: 8,
  },
  actions: {
    paddingVertical: 24,
  },
  cancelButton: {
    marginTop: 12,
  },
});
