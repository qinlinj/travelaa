"use client";

import { useEffect, useState } from "react";

import { AddExpenseDialog } from "@/components/add-expense-dialog";
import { AddExpenseFab } from "@/components/add-expense-fab";
import { ExpenseList } from "@/components/expense-list";
import { LedgerHeader } from "@/components/ledger-header";
import { LedgerOverview } from "@/components/ledger-overview";
import { MembersSection } from "@/components/members-section";
import { useLedgerStore } from "@/store/ledger-store";
import type { Expense } from "@/types";

export function LedgerDashboard() {
  const hydrate = useLedgerStore((state) => state.hydrate);
  const isHydrated = useLedgerStore((state) => state.isHydrated);
  const members = useLedgerStore((state) => state.ledger.members);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const hasMembers = members.length > 0;

  function openAdd() {
    setEditing(null);
    setExpenseOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditing(expense);
    setExpenseOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <LedgerHeader />
      {isHydrated && !hasMembers ? <MembersSection /> : null}
      <LedgerOverview />
      <ExpenseList onEdit={openEdit} />
      {isHydrated && hasMembers ? <MembersSection /> : null}

      <AddExpenseFab onClick={openAdd} />
      <AddExpenseDialog
        open={expenseOpen}
        onOpenChange={(open) => {
          setExpenseOpen(open);
          if (!open) {
            setEditing(null);
          }
        }}
        expense={editing}
      />
    </div>
  );
}
