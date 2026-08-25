import { SettlementView } from "@/components/settlement-view";

export default function SettlePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 md:max-w-4xl">
      <SettlementView />
    </main>
  );
}
