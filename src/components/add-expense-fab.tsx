"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type AddExpenseFabProps = {
  onClick: () => void;
};

export function AddExpenseFab({ onClick }: AddExpenseFabProps) {
  return (
    <div className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 px-4 sm:px-6">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onClick}
          className="pointer-events-auto h-14 min-h-11 rounded-full px-5 shadow-lg"
        >
          <PlusIcon data-icon="inline-start" />
          Add expense
        </Button>
      </div>
    </div>
  );
}
