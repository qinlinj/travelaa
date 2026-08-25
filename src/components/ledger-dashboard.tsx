"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { AddExpenseDialog } from "@/components/add-expense-dialog";
import { AddExpenseFab } from "@/components/add-expense-fab";
import { ExpenseList } from "@/components/expense-list";
import { LedgerHeader } from "@/components/ledger-header";
import { LedgerOverview } from "@/components/ledger-overview";
import { MembersSection } from "@/components/members-section";
import { Button } from "@/components/ui/button";
import { useLedgerStore } from "@/store/ledger-store";

export function LedgerDashboard() {
  const hydrate = useLedgerStore((state) => state.hydrate);
  const [expenseOpen, setExpenseOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="flex flex-col gap-6">
      <LedgerHeader />
      <Button asChild className="min-h-11 w-full sm:w-auto">
        <Link href="/settle">Settle up</Link>
      </Button>
      <LedgerOverview />
      <MembersSection />
      <ExpenseList />

      <button
        type="button"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        onClick={() => setExpenseOpen(true)}
      >
        Add expense
      </button>
      <AddExpenseFab onClick={() => setExpenseOpen(true)} />
      <AddExpenseDialog open={expenseOpen} onOpenChange={setExpenseOpen} />
    </div>
  );
}
