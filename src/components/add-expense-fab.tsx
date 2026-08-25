"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type AddExpenseFabProps = {
  onClick: () => void;
};

export function AddExpenseFab({ onClick }: AddExpenseFabProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 h-14 rounded-full px-5 shadow-lg"
    >
      <PlusIcon data-icon="inline-start" />
      Add expense
    </Button>
  );
}
