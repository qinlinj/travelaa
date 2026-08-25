import type { Expense } from "@/types";

export type CategoryTotal = {
  category: string;
  amount: number;
};

export function computeCategoryBreakdown(
  expenses: Expense[],
): CategoryTotal[] {
  const totals = new Map<string, number>();

  for (const expense of expenses) {
    totals.set(
      expense.category,
      (totals.get(expense.category) ?? 0) + expense.amount,
    );
  }

  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort(
      (left, right) =>
        right.amount - left.amount ||
        left.category.localeCompare(right.category),
    );
}
