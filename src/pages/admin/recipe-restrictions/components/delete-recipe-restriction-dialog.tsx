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

import type { IngredientUI } from "../api";
import { ingredientsApi } from "@/shared/api/ingredients.api";
interface DeleteIngredientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredients: IngredientUI[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteIngredientsDialog({
  open,
  onOpenChange,
  ingredients,
  onSuccess,
}: DeleteIngredientsDialogProps) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      try {
            await Promise.all(
            ingredients.map((ingredient) => ingredientsApi.delete(ingredient?.id))
           );
        toast.success("Ingredients deleted successfully");
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        toast.error("Some ingredients could not be deleted");
      }
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Ingredients</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {ingredients.length} ingredient(s)?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
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