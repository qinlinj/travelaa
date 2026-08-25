"use client";

import { useEffect } from "react";
import Link from "next/link";

import { AddExpenseDialog } from "@/components/add-expense-dialog";
import { ExpenseList } from "@/components/expense-list";
import { LedgerHeader } from "@/components/ledger-header";
import { LedgerOverview } from "@/components/ledger-overview";
import { MembersSection } from "@/components/members-section";
import { Button } from "@/components/ui/button";
import { useLedgerStore } from "@/store/ledger-store";

export function LedgerDashboard() {
  const hydrate = useLedgerStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="flex flex-col gap-6">
      <LedgerHeader />
      <LedgerOverview />
      <div className="flex flex-wrap items-center gap-2">
        <AddExpenseDialog />
        <Button asChild variant="outline">
          <Link href="/settle">Settle up</Link>
        </Button>
      </div>
      <MembersSection />
      <ExpenseList />
    </div>
  );
}
