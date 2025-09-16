// // src/components/CategoriesList.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Category from "./Category";
import { colors } from "../config/colors";

interface CategoriesListProps {
  categories: Array<{
    id: number;
    name: string;
    currentVal: number;
    limit: number;
    color: string;
  }>;
}

export default function CategoriesList({ categories }: CategoriesListProps) {
  return (
    <View style={listStyles.container}>
      <Text style={listStyles.title}>Budget Categories</Text>
      <View style={listStyles.list}>
        {categories.map((category) => (
          <Category key={category.id} category={category} />
        ))}
      </View>
    </View>
  );
}

const listStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.DARK,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
});
