"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, ShieldAlert, Trash2 } from "lucide-react";

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
import { Badge } from "@/shared/components/ui/badge";

import type { HealthRecipeMappingUI } from "../api";
import { healthRecipeMappingApi } from "@/shared/api/recipe-restriction.api";

interface DeleteHealthRecipeMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mapping:any| HealthRecipeMappingUI | null;
  onSuccess?: () => void;
}

export function DeleteHealthRecipeMappingDialog({
  open,
  onOpenChange,
  mapping,
  onSuccess,
}: DeleteHealthRecipeMappingDialogProps) {
  const [isPending, startTransition] = React.useTransition();

  if (!mapping) return null;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await healthRecipeMappingApi.delete(mapping.id);
        toast.success("Health restriction removed");
        onOpenChange(false);
        onSuccess?.();
      } catch (error: any) {
        console.error("Delete failed:", error);
        toast.error(
          error?.response?.data?.detail || "Failed to delete health restriction"
        );
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-120">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Delete Health Restriction
          </AlertDialogTitle>

          <AlertDialogDescription className="space-y-4">
            <p>
              You are about to remove this health rule. This may change how the
              recipe appears for users with specific conditions.
            </p>

            <div className="rounded-md border p-3 space-y-2 bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipe</span>
                <span className="font-medium">{mapping.recipe}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Condition</span>
                <span>{mapping.condition}</span>
              </div>

              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Restriction</span>
                <Badge
                  variant={
                    mapping.restriction_type === "avoid" ? "destructive" : "default"
                  }
                  className="capitalize"
                >
                  {mapping.restriction_type === "avoid" ? "Avoid" : "Recommended"}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-destructive font-medium">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
