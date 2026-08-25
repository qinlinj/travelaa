"use client";

import { computeBalances } from "@/lib/balances";
import { formatAmount, formatSignedAmount, memberCountLabel } from "@/lib/format";
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

export function LedgerHeader() {
  const ledger = useLedgerStore((state) => state.ledger);
  const setTitle = useLedgerStore((state) => state.setTitle);
  const summary = computeBalances(ledger);

  function handleTitleBlur() {
    if (!ledger.title.trim()) {
      setTitle("Untitled ledger");
    }
  }

  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          TravelAA
        </p>
        <p className="text-sm text-muted-foreground">
          {memberCountLabel(ledger.members.length)}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="sr-only" htmlFor="ledger-title">
          Ledger title
        </label>
        <input
          id="ledger-title"
          name="ledgerTitle"
          value={ledger.title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={handleTitleBlur}
          className="w-full bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none"
        />
        <p className="text-sm text-muted-foreground">
          Shared trip ledger. Edit the title anytime.
        </p>
      </div>

      {ledger.members.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add members below to see who paid and who still owes.
        </p>
      ) : (
        <ul className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible">
          {summary.balances.map((balance) => {
            const name =
              ledger.members.find((member) => member.id === balance.memberId)
                ?.name ?? "Unknown";

            return (
              <li
                key={balance.memberId}
                className="min-w-[10.5rem] shrink-0 rounded-xl border border-border bg-card p-3 shadow-none"
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
    </header>
  );
}
