"use client";

import { useEffect } from "react";
import Link from "next/link";

import { SettlementPaths } from "@/components/settlement-paths";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { computeBalances } from "@/lib/balances";
import { formatAmount, formatSignedAmount } from "@/lib/format";
import { memberNamesById } from "@/lib/settlement-graph";
import { settleBalances } from "@/lib/settlement";
import { useLedgerStore } from "@/store/ledger-store";

function netClassName(net: number): string {
  if (net > 0.005) {
    return "text-[#3f6f64]";
  }
  if (net < -0.005) {
    return "text-[#9a4d4d]";
  }
  return "text-muted-foreground";
}

export function SettlementView() {
  const ledger = useLedgerStore((state) => state.ledger);
  const hydrate = useLedgerStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const summary = computeBalances(ledger);
  const plan = settleBalances(summary.balances);
  const names = memberNamesById(ledger.members);
  const hasTransfers = plan.before.length > 0 || plan.after.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          TravelAA
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Back to ledger</Link>
        </Button>
      </div>

      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Settle up</h1>
        <p className="text-sm text-muted-foreground">
          See the messy original routes, then the simplified path.
        </p>
      </header>

      {ledger.members.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add people and expenses on the ledger first.
        </p>
      ) : (
        <ul className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible">
          {summary.balances.map((balance) => {
            const name = names[balance.memberId] ?? "Unknown";
            return (
              <li
                key={balance.memberId}
                className="min-w-[10.5rem] shrink-0 rounded-xl border border-border bg-card p-3"
              >
                <p className="truncate font-medium">{name}</p>
                <dl className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Paid</dt>
                    <dd className="tabular-nums">{formatAmount(balance.paid)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Should pay</dt>
                    <dd className="tabular-nums">{formatAmount(balance.owed)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Net</dt>
                    <dd
                      className={`tabular-nums font-medium ${netClassName(balance.net)}`}
                    >
                      {formatSignedAmount(balance.net)}
                    </dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      )}

      <section
        aria-labelledby="reduction-heading"
        className="rounded-xl border border-border bg-card px-4 py-5 text-center"
      >
        <p
          id="reduction-heading"
          className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase"
        >
          Transactions reduced from
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
          {plan.reducedFrom} to {plan.reducedTo}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasTransfers
            ? "Fewer arrows mean a simpler way to settle."
            : "No transfers are required right now."}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Before</CardTitle>
            <CardDescription>
              Naive routes — every debtor pays every creditor a slice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettlementPaths
              transfers={plan.before}
              names={names}
              messy
              variant="before"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>After</CardTitle>
            <CardDescription>
              Greedy path — largest debts meet largest credits first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettlementPaths
              transfers={plan.after}
              names={names}
              variant="after"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimal path</CardTitle>
          <CardDescription>Who pays whom how much after simplification.</CardDescription>
        </CardHeader>
        <CardContent>
          {plan.after.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Everyone is already settled. No transfers needed.
            </p>
          ) : (
            <ol className="flex flex-col gap-2">
              {plan.after.map((transfer) => (
                <li
                  key={`${transfer.from}-${transfer.to}-${transfer.amount}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2"
                >
                  <p className="min-w-0 text-sm">
                    <span className="font-medium">
                      {names[transfer.from] ?? "Unknown"}
                    </span>
                    <span className="text-muted-foreground"> pays </span>
                    <span className="font-medium">
                      {names[transfer.to] ?? "Unknown"}
                    </span>
                  </p>
                  <p className="tabular-nums font-semibold">
                    {formatAmount(transfer.amount)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
