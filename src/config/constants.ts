export const CATEGORIES = [
  { id: 1, name: "Health", currentVal: 0, limit: 200, color: "red" },
  { id: 2, name: "Fun", currentVal: 0, limit: 100, color: "green" },
  { id: 3, name: "Travel", currentVal: 0, limit: 150, color: "orange" },
  { id: 4, name: "Food", currentVal: 0, limit: 1000, color: "blue" },
  { id: 5, name: "Shopping", currentVal: 0, limit: 75, color: "purple" },
  { id: 6, name: "Transport", currentVal: 0, limit: 150, color: "brown" },
  { id: 7, name: "Bills", currentVal: 0, limit: 600, color: "pink" },
  { id: 8, name: "Other", currentVal: 0, limit: 200, color: "black" },
] as const;

export const CATEGORY_NAMES = [
  "Fun",
  "Health",
  "Food",
  "Bills",
  "Transport",
] as const;
