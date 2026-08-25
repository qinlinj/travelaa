"use client";

import { useEffect } from "react";

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

function formatDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(parsed);
}

export function ExpenseList() {
  const members = useLedgerStore((state) => state.ledger.members);
  const expenses = useLedgerStore((state) => state.ledger.expenses);
  const isHydrated = useLedgerStore((state) => state.isHydrated);
  const hydrate = useLedgerStore((state) => state.hydrate);
  const deleteExpense = useLedgerStore((state) => state.deleteExpense);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  function memberName(memberId: string): string {
    return members.find((member) => member.id === memberId)?.name ?? "Unknown";
  }

  const ordered = sortExpensesNewestFirst(expenses);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>Newest dates appear first.</CardDescription>
      </CardHeader>
      <CardContent>
        {isHydrated && ordered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No expenses yet. Tap Add expense to record the first one.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {ordered.map((expense) => (
              <li
                key={expense.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3"
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
                    Paid by {memberName(expense.paidBy)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {expense.participants.length}{" "}
                    {expense.participants.length === 1
                      ? "participant"
                      : "participants"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-11 self-start px-4"
                  onClick={() => deleteExpense(expense.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
