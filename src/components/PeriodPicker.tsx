import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../config/colors";
import { getCurrentMonth, getMonthName } from "../utils";

interface PeriodPickerProps {
  month: number;
  year: number;
  onPeriodChange: (month: number, year: number) => void;
}

export default function PeriodPicker({
  month,
  year,
  onPeriodChange,
}: PeriodPickerProps) {
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
    <View style={pickerStyles.container}>
      <TouchableOpacity onPress={goToPrevious} style={pickerStyles.button}>
        <FontAwesome name="chevron-left" size={18} color={colors.GREEN} />
      </TouchableOpacity>

      <View style={pickerStyles.dateContainer}>
        <Text style={pickerStyles.dateText}>
          {getMonthName(month)}, {year}
        </Text>
      </View>

      <TouchableOpacity
        onPress={goToNext}
        style={[
          pickerStyles.button,
          !canGoForward() && pickerStyles.buttonDisabled,
        ]}
        disabled={!canGoForward()}
      >
        <FontAwesome
          name="chevron-right"
          size={18}
          color={canGoForward() ? colors.GREEN : colors.GRAY}
        />
      </TouchableOpacity>
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  button: {
    padding: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  dateContainer: {
    minWidth: 180,
    alignItems: "center",
    marginHorizontal: 20,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.DARK,
  },
});
