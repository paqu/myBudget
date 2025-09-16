// src/components/Category.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../config/colors";
import { formatCurrencyShort } from "../utils";

interface CategoryProps {
  category: {
    id: number;
    name: string;
    currentVal: number;
    limit: number;
    color: string;
  };
}

export default function Category({ category }: CategoryProps) {
  const { name, currentVal, limit, color } = category;

  const getProgressColor = (current: number, limit: number) => {
    const ratio = current / limit;
    if (ratio <= 0.7) return colors.GREEN;
    if (ratio <= 1.0) return "#f39c12"; // orange
    return colors.TORCH_RED;
  };

  const progressColor = getProgressColor(currentVal, limit);
  const progressPercentage = Math.min((currentVal / limit) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={[styles.amount, { color: progressColor }]}>
            {formatCurrencyShort(currentVal)} / {formatCurrencyShort(limit)}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
          <Text style={styles.percentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const categoryStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.DARK,
  },
  amount: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginRight: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  percentage: {
    fontSize: 12,
    color: colors.GRAY,
    minWidth: 35,
    textAlign: "right",
  },
});

// Update the styles reference
const styles = categoryStyles;
