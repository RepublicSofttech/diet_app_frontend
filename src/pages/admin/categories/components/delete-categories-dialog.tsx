"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

import type { Category } from "../api";
import { categoriesApi } from "@/shared/api/category.api";

interface DeleteCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteCategoriesDialog({
  open,
  onOpenChange,
  categories,
  // showTrigger = true,
  onSuccess,
}: DeleteCategoriesDialogProps) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      try {
        await Promise.all(
          categories.map((category) => categoriesApi.deleteCategory(category.id))
        );
        toast.success("Categories deleted successfully");
        onOpenChange(false);
        onSuccess?.();
        // Refresh the page
        // window.location.reload();
      } catch (error) {
        toast.error("Some categories could not be deleted");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Categories</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">{categories.length}</span> categories?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
