"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

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
import { Separator } from "@/components/ui/separator";
import { useLedgerStore } from "@/store/ledger-store";

export function MembersSection() {
  const inputId = useId();
  const errorId = useId();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const members = useLedgerStore((state) => state.ledger.members);
  const isHydrated = useLedgerStore((state) => state.isHydrated);
  const hydrate = useLedgerStore((state) => state.hydrate);
  const addMember = useLedgerStore((state) => state.addMember);
  const removeMember = useLedgerStore((state) => state.removeMember);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextError = addMember(name);
    setError(nextError);

    if (!nextError) {
      setName("");
    }
  }

  function handleRemove(memberId: string) {
    setError(removeMember(memberId));
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          Add or remove people on this trip. No login is required.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor={inputId}>Member name</Label>
            <Input
              id={inputId}
              name="memberName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Alex"
              autoComplete="off"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          {error ? (
            <p id={errorId} className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full sm:w-auto">
            Add member
          </Button>
        </form>

        <Separator />

        {isHydrated && members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No members yet. Add the first person on this trip.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <span className="min-w-0 truncate font-medium">
                  {member.name}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(member.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
