import { EXPENSE_CATEGORIES } from "@/types";
import type { Expense, Ledger } from "@/types";

export const CUSTOM_SHARE_TOLERANCE = 0.01;

export type ExpenseDraft = {
  amount: number | string;
  description: string;
  category: string;
  date: string;
  paidBy: string;
  participants: string[];
  splitType: "equal" | "custom";
  customShares?: Record<string, number | string>;
  receiptUrl?: string;
};

export type ExpenseActionResult =
  | { ok: true; expenses: Expense[] }
  | { ok: false; error: string };

export function todayInputValue(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addExpense(
  ledger: Ledger,
  draft: ExpenseDraft,
  id: string = crypto.randomUUID(),
): ExpenseActionResult {
  if (ledger.members.length === 0) {
    return {
      ok: false,
      error: "Add at least one member before recording an expense.",
    };
  }

  const amount = parseAmount(draft.amount);
  if (amount === null) {
    return { ok: false, error: "Enter a positive amount." };
  }

  const description = draft.description.trim();
  if (!description) {
    return { ok: false, error: "Enter a description." };
  }

  if (!isExpenseCategory(draft.category)) {
    return { ok: false, error: "Choose a category." };
  }

  const date = toIsoDate(draft.date);
  if (!date) {
    return { ok: false, error: "Choose a date." };
  }

  const memberIds = new Set(ledger.members.map((member) => member.id));
  if (!draft.paidBy || !memberIds.has(draft.paidBy)) {
    return { ok: false, error: "Choose who paid." };
  }

  const participants = uniqueIds(draft.participants).filter((participantId) =>
    memberIds.has(participantId),
  );
  if (participants.length === 0) {
    return { ok: false, error: "Select at least one participant." };
  }

  const expense: Expense = {
    id,
    amount,
    description,
    category: draft.category,
    date,
    paidBy: draft.paidBy,
    participants,
    splitType: draft.splitType,
  };

  if (draft.splitType === "custom") {
    const shares = parseCustomShares(participants, draft.customShares, amount);
    if (!shares.ok) {
      return shares;
    }
    expense.customShares = shares.shares;
  }

  if (draft.receiptUrl) {
    expense.receiptUrl = draft.receiptUrl;
  }

  return {
    ok: true,
    expenses: [...ledger.expenses, expense],
  };
}

export function deleteExpense(
  ledger: Ledger,
  expenseId: string,
): ExpenseActionResult {
  if (!ledger.expenses.some((expense) => expense.id === expenseId)) {
    return { ok: false, error: "Expense not found." };
  }

  return {
    ok: true,
    expenses: ledger.expenses.filter((expense) => expense.id !== expenseId),
  };
}

export function sortExpensesNewestFirst(expenses: Expense[]): Expense[] {
  return expenses
    .map((expense, index) => ({ expense, index }))
    .sort((left, right) => {
      const dateDiff =
        Date.parse(right.expense.date) - Date.parse(left.expense.date);
      if (dateDiff !== 0) {
        return dateDiff;
      }
      return right.index - left.index;
    })
    .map(({ expense }) => expense);
}

function parseAmount(value: number | string): number | null {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }
  return amount;
}

function toIsoDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T00:00:00.000Z`;
  }

  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return new Date(parsed).toISOString();
}

function parseCustomShares(
  participants: string[],
  raw: Record<string, number | string> | undefined,
  amount: number,
): { ok: true; shares: Record<string, number> } | { ok: false; error: string } {
  if (!raw) {
    return {
      ok: false,
      error: "Enter a custom share for each participant.",
    };
  }

  const shares: Record<string, number> = {};

  for (const participantId of participants) {
    const value =
      typeof raw[participantId] === "number"
        ? raw[participantId]
        : Number(raw[participantId]);

    if (!Number.isFinite(value) || value < 0) {
      return {
        ok: false,
        error: "Enter a custom share for each participant.",
      };
    }

    shares[participantId] = value;
  }

  const sum = participants.reduce(
    (total, participantId) => total + shares[participantId],
    0,
  );

  if (Math.abs(sum - amount) > CUSTOM_SHARE_TOLERANCE) {
    return {
      ok: false,
      error: "Custom shares must add up to the expense amount.",
    };
  }

  return { ok: true, shares };
}

function isExpenseCategory(
  value: string,
): value is (typeof EXPENSE_CATEGORIES)[number] {
  return (EXPENSE_CATEGORIES as readonly string[]).includes(value);
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)];
}
