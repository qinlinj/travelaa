"use client";

import { create } from "zustand";

import {
  createEmptyLedger,
  getBrowserStorage,
  loadLedger,
  replaceExpenses as withExpenses,
  replaceMembers as withMembers,
  saveLedger,
  updateLedgerTitle,
  type StorageLike,
} from "@/lib/ledger-storage";
import {
  addMember as addMemberToList,
  removeMember as removeMemberFromLedger,
} from "@/lib/members";
import type { Expense, Ledger, Member } from "@/types";

export type LedgerStore = {
  ledger: Ledger;
  isHydrated: boolean;
  hydrate: () => void;
  setTitle: (title: string) => void;
  addMember: (name: string) => string | null;
  removeMember: (memberId: string) => string | null;
  replaceMembers: (members: Member[]) => void;
  replaceExpenses: (expenses: Expense[]) => void;
  replaceLedger: (ledger: Ledger) => void;
};

export function createLedgerStore(
  storage: StorageLike | null = getBrowserStorage(),
) {
  return create<LedgerStore>((set, get) => ({
    ledger: createEmptyLedger(),
    isHydrated: false,
    hydrate() {
      set({
        ledger: loadLedger(storage) ?? get().ledger,
        isHydrated: true,
      });
    },
    setTitle(title) {
      const ledger = updateLedgerTitle(get().ledger, title);
      saveLedger(ledger, storage);
      set({ ledger });
    },
    addMember(name) {
      const result = addMemberToList(get().ledger.members, name);
      if (!result.ok) {
        return result.error;
      }

      const ledger = { ...get().ledger, members: result.members };
      saveLedger(ledger, storage);
      set({ ledger });
      return null;
    },
    removeMember(memberId) {
      const result = removeMemberFromLedger(get().ledger, memberId);
      if (!result.ok) {
        return result.error;
      }

      const ledger = { ...get().ledger, members: result.members };
      saveLedger(ledger, storage);
      set({ ledger });
      return null;
    },
    replaceMembers(members) {
      const ledger = withMembers(get().ledger, members);
      saveLedger(ledger, storage);
      set({ ledger });
    },
    replaceExpenses(expenses) {
      const ledger = withExpenses(get().ledger, expenses);
      saveLedger(ledger, storage);
      set({ ledger });
    },
    replaceLedger(ledger) {
      saveLedger(ledger, storage);
      set({ ledger });
    },
  }));
}

export const useLedgerStore = createLedgerStore();
