"use client";

import { ExpenseForm } from "@/components/expense-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AddExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddExpenseDialog({ open, onOpenChange }: AddExpenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add expense</DialogTitle>
          <DialogDescription>
            Record what was spent. It is saved on this device.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm embedded onSaved={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
