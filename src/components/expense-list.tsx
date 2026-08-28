"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sortExpensesNewestFirst } from "@/lib/expenses";
import { formatAmount } from "@/lib/format";
import { useLedgerStore } from "@/store/ledger-store";
import type { Expense } from "@/types";

function formatDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(parsed);
}

function joinNames(names: string[]): string {
  if (names.length === 0) {
    return "no one";
  }
  if (names.length === 1) {
    return names[0] ?? "Unknown";
  }
  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

type ExpenseListProps = {
  onEdit: (expense: Expense) => void;
};

type UndoState = {
  expense: Expense;
  index: number;
};

export function ExpenseList({ onEdit }: ExpenseListProps) {
  const members = useLedgerStore((state) => state.ledger.members);
  const expenses = useLedgerStore((state) => state.ledger.expenses);
  const isHydrated = useLedgerStore((state) => state.isHydrated);
  const hydrate = useLedgerStore((state) => state.hydrate);
  const deleteExpense = useLedgerStore((state) => state.deleteExpense);
  const replaceExpenses = useLedgerStore((state) => state.replaceExpenses);

  const [undo, setUndo] = useState<UndoState | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!undo) {
      return;
    }

    const timeout = window.setTimeout(() => setUndo(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [undo]);

  function memberName(memberId: string): string {
    return members.find((member) => member.id === memberId)?.name ?? "Unknown";
  }

  function handleDelete(expense: Expense) {
    const index = expenses.findIndex((item) => item.id === expense.id);
    const error = deleteExpense(expense.id);
    if (!error && index !== -1) {
      setUndo({ expense, index });
    }
  }

  function handleUndo() {
    if (!undo) {
      return;
    }

    const next = [...useLedgerStore.getState().ledger.expenses];
    const insertAt = Math.min(undo.index, next.length);
    next.splice(insertAt, 0, undo.expense);
    replaceExpenses(next);
    setUndo(null);
  }

  const ordered = sortExpensesNewestFirst(expenses);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>Newest dates appear first. Tap a row to edit.</CardDescription>
      </CardHeader>
      <CardContent>
        {isHydrated && ordered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No expenses yet. Tap Add expense to record the first one.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {ordered.map((expense) => {
              const participantNames = expense.participants.map(memberName);

              return (
                <li key={expense.id}>
                  <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3">
                    <button
                      type="button"
                      className="flex flex-col gap-2 rounded-lg text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      onClick={() => onEdit(expense)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(expense.date)}
                          </p>
                        </div>
                        <p className="text-base font-semibold tabular-nums">
                          {formatAmount(expense.amount)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{expense.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Paid by {memberName(expense.paidBy)} ·{" "}
                          {joinNames(participantNames)}
                        </span>
                      </div>
                    </button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="min-h-11 self-start px-4"
                      onClick={() => handleDelete(expense)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      {undo ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-[max(5.75rem,calc(4.75rem+env(safe-area-inset-bottom)))] z-40">
          <div className="mx-auto flex max-w-2xl justify-start px-4 sm:px-6">
            <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-foreground px-3 py-2 text-sm text-background shadow-lg">
              <span>Expense deleted</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="min-h-11"
                onClick={handleUndo}
              >
                Undo
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
