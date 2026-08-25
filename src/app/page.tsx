import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-6 text-foreground">
      <h1 className="text-3xl font-semibold tracking-tight">TravelAA</h1>
      <p className="text-muted-foreground">
        This is TravelAA. Stage 1 scaffold is ready.
      </p>
      <Button type="button">Get started</Button>
    </main>
  );
}
