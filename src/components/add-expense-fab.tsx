"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type AddExpenseFabProps = {
  onClick: () => void;
};

export function AddExpenseFab({ onClick }: AddExpenseFabProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40">
      <div className="mx-auto flex max-w-2xl justify-end px-4 sm:px-6">
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
