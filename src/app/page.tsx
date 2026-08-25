import { LedgerDashboard } from "@/components/ledger-dashboard";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8">
      <LedgerDashboard />
    </main>
  );
}
