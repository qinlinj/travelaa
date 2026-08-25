import { describe, expect, it } from "vitest";

import { LEDGER_STORAGE_KEY } from "@/lib/ledger-storage";
import { createLedgerStore } from "@/store/ledger-store";
import type { Member } from "@/types";

describe("createLedgerStore", () => {
  it("starts with an empty in-memory ledger and hydrates from storage", () => {
    const stored = {
      id: "ledger-1",
      title: "Stored trip",
      createdAt: "2026-08-25T00:00:00.000Z",
      members: [] as Member[],
      expenses: [],
      status: "active" as const,
    };
    const storage = {
      getItem: () => JSON.stringify(stored),
      setItem: () => undefined,
      removeItem: () => undefined,
    };

    const store = createLedgerStore(storage);

    expect(store.getState().isHydrated).toBe(false);
    expect(store.getState().ledger.members).toEqual([]);

    store.getState().hydrate();

    expect(store.getState().isHydrated).toBe(true);
    expect(store.getState().ledger).toEqual(stored);
  });

  it("persists title, members, and expenses through the store", () => {
    const data: Record<string, string> = {};
    const storage = {
      getItem: (key: string) => data[key] ?? null,
      setItem: (key: string, value: string) => {
        data[key] = value;
      },
      removeItem: (key: string) => {
        delete data[key];
      },
    };
    const store = createLedgerStore(storage);
    const members: Member[] = [{ id: "m1", name: "Alice" }];

    store.getState().setTitle("Kyoto");
    store.getState().replaceMembers(members);
    store.getState().replaceExpenses([]);

    expect(store.getState().ledger.title).toBe("Kyoto");
    expect(store.getState().ledger.members).toEqual(members);
    expect(data[LEDGER_STORAGE_KEY]).toContain("Kyoto");
  });
});
