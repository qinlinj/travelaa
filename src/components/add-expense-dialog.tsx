"use client";

import { useState } from "react";

import { ExpenseForm } from "@/components/expense-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Add expense</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add expense</DialogTitle>
          <DialogDescription>
            Record what was spent. It is saved on this device.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm embedded onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
