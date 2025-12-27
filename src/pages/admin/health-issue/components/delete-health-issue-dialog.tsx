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

import type { HealthIssue } from "../api";
import { healthIssueApi } from "@/shared/api/health-issue.api";

interface DeleteHealthIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  healthIssue: HealthIssue[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeletehealthIssueDialog({
  open,
  onOpenChange,
  healthIssue,
  onSuccess,
}: DeleteHealthIssueDialogProps) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      try {
        await Promise.all(
          healthIssue.map((healthIssue) => healthIssueApi.delete(healthIssue.id))
        );
        toast.success("Health issue deleted successfully");
        onOpenChange(false);
        onSuccess?.();
        // Refresh the page
        // window.location.reload();
      } catch (error) {
        toast.error("Some health issue could not be deleted");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete health issue</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">{healthIssue.length}</span> health issue?
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
