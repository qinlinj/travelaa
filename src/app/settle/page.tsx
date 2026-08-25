import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SettlePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-4 bg-background px-4 py-8 text-foreground sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Settle up</h1>
      <p className="text-sm text-muted-foreground">
        Settlement path visualization arrives in the next stage.
      </p>
      <Button asChild variant="outline" className="w-fit">
        <Link href="/">Back to ledger</Link>
      </Button>
    </main>
  );
}
