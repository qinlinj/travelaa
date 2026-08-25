"use client";

import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { todayInputValue, type ExpenseDraft } from "@/lib/expenses";
import { useLedgerStore } from "@/store/ledger-store";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types";

export function ExpenseForm() {
  const errorId = useId();
  const amountId = useId();
  const descriptionId = useId();
  const dateId = useId();
  const receiptId = useId();

  const members = useLedgerStore((state) => state.ledger.members);
  const hydrate = useLedgerStore((state) => state.hydrate);
  const addExpense = useLedgerStore((state) => state.addExpense);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [date, setDate] = useState(todayInputValue);
  const [paidBy, setPaidBy] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[] | null>(null);
  const [splitType, setSplitType] = useState<ExpenseDraft["splitType"]>("equal");
  const [customShares, setCustomShares] = useState<Record<string, string>>({});
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const resolvedPaidBy =
    paidBy && members.some((member) => member.id === paidBy)
      ? paidBy
      : (members[0]?.id ?? "");
  const resolvedParticipants =
    participants === null
      ? members.map((member) => member.id)
      : participants.filter((id) =>
          members.some((member) => member.id === id),
        );

  function resetForm() {
    setAmount("");
    setDescription("");
    setCategory("Food");
    setDate(todayInputValue());
    setSplitType("equal");
    setCustomShares({});
    setReceiptUrl(undefined);
    setPaidBy(null);
    setParticipants(null);
  }

  function toggleParticipant(memberId: string) {
    const next = resolvedParticipants.includes(memberId)
      ? resolvedParticipants.filter((id) => id !== memberId)
      : [...resolvedParticipants, memberId];
    setParticipants(next);
  }

  function handleReceiptChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setReceiptUrl(undefined);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setReceiptUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextError = addExpense({
      amount,
      description,
      category,
      date,
      paidBy: resolvedPaidBy,
      participants: resolvedParticipants,
      splitType,
      customShares,
      receiptUrl,
    });
    setError(nextError);

    if (!nextError) {
      resetForm();
      event.currentTarget.reset();
    }
  }

  const canSubmit = members.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add expense</CardTitle>
        <CardDescription>
          Record what was spent. Balances come in a later stage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor={amountId}>Amount</Label>
            <Input
              id={amountId}
              name="expenseAmount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={descriptionId}>Description</Label>
            <Input
              id={descriptionId}
              name="expenseDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Dinner, taxi, tickets..."
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={dateId}>Date</Label>
            <Input
              id={dateId}
              name="expenseDate"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="paidBy">Paid by</Label>
            <Select
              value={resolvedPaidBy || undefined}
              onValueChange={setPaidBy}
              disabled={!canSubmit}
            >
              <SelectTrigger id="paidBy" className="w-full">
                <SelectValue placeholder="Add a member first" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">Participants</legend>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => {
                const selected = resolvedParticipants.includes(member.id);
                return (
                  <Button
                    key={member.id}
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    aria-pressed={selected}
                    onClick={() => toggleParticipant(member.id)}
                  >
                    {member.name}
                  </Button>
                );
              })}
            </div>
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add at least one member before recording an expense.
              </p>
            ) : null}
          </fieldset>

          <div className="flex flex-col gap-2">
            <Label>Split type</Label>
            <Tabs
              value={splitType}
              onValueChange={(value) =>
                setSplitType(value as ExpenseDraft["splitType"])
              }
            >
              <TabsList className="w-full">
                <TabsTrigger value="equal">Equal</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {splitType === "custom" ? (
            <div className="flex flex-col gap-3">
              {resolvedParticipants.map((participantId) => {
                const member = members.find((item) => item.id === participantId);
                if (!member) {
                  return null;
                }

                const shareId = `${receiptId}-${participantId}`;
                return (
                  <div key={participantId} className="flex flex-col gap-2">
                    <Label htmlFor={shareId}>{member.name} share</Label>
                    <Input
                      id={shareId}
                      name={`share-${participantId}`}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={customShares[participantId] ?? ""}
                      onChange={(event) =>
                        setCustomShares((current) => ({
                          ...current,
                          [participantId]: event.target.value,
                        }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor={receiptId}>Receipt (optional)</Label>
            <Input
              id={receiptId}
              name="receipt"
              type="file"
              accept="image/*"
              onChange={handleReceiptChange}
            />
            {receiptUrl ? (
              // Data-URL preview is local-only; next/image cannot optimize it.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={receiptUrl}
                alt="Receipt preview"
                className="max-h-40 w-full rounded-lg border border-border object-contain"
              />
            ) : null}
          </div>

          {error ? (
            <p id={errorId} className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit}>
            Save expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
