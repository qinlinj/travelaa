export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

export function formatSignedAmount(amount: number): string {
  if (Math.abs(amount) < 0.005) {
    return "0.00";
  }

  return amount > 0 ? `+${amount.toFixed(2)}` : amount.toFixed(2);
}

export function memberCountLabel(count: number): string {
  return count === 1 ? "1 member" : `${count} members`;
}
