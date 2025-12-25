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

import type { Recipe } from "../api";
import { recipesApi } from "@/shared/api/recipe.api";

interface DeleteRecipesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: Recipe[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteRecipesDialog({
  open,
  onOpenChange,
  recipes,
  showTrigger = true,
  onSuccess,
}: DeleteRecipesDialogProps) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      try {
        await Promise.all(
          recipes.map((recipe) =>
            recipesApi.delete(recipe.id),
          ),
        );

        toast.success("Recipes deleted successfully");
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        toast.error("Some recipes could not be deleted");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Recipes</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">
              {recipes.length}
            </span>{" "}
            recipes? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>
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
