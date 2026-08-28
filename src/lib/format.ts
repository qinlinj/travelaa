export const DEFAULT_LEDGER_TITLE = "Untitled ledger";

export function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatSignedAmount(amount: number): string {
  if (Math.abs(amount) < 0.005) {
    return "$0.00";
  }

  return amount > 0 ? `+$${amount.toFixed(2)}` : `-$${Math.abs(amount).toFixed(2)}`;
}

export function memberCountLabel(count: number): string {
  return count === 1 ? "1 member" : `${count} members`;
}

export function isDefaultLedgerTitle(title: string): boolean {
  return title.trim().toLowerCase() === DEFAULT_LEDGER_TITLE.toLowerCase();
}

export function memberNamesById(
  members: { id: string; name: string }[],
): Record<string, string> {
  return Object.fromEntries(members.map((member) => [member.id, member.name]));
}
