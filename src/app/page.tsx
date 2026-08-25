import { ExpenseForm } from "@/components/expense-form";
import { ExpenseList } from "@/components/expense-list";
import { MembersSection } from "@/components/members-section";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-6 bg-background px-4 py-8 text-foreground sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">TravelAA</h1>
        <p className="text-sm text-muted-foreground">
          Add people, then record expenses for this trip.
        </p>
      </header>
      <MembersSection />
      <ExpenseForm />
      <ExpenseList />
    </main>
  );
}
