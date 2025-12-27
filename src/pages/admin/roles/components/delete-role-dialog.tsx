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

import type { Role } from "../api";
import { roleApi } from "@/shared/api/role.api";
import { FullPageLoader } from "@/shared/components/spinner/FullPageLoader";

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteRoleDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: DeleteRoleDialogProps) {
  const [isPending, startTransition] = useTransition();
  const onDelete = () => {
    startTransition(async () => {
      try {
        await Promise.all(
          role.map((role) => roleApi.delete(role.id))
          
        );
        toast.success("Role deleted successfully");
        onOpenChange(false);
        onSuccess?.();
        // Refresh the page
        // window.location.reload();
      } catch (error) {
        toast.error("Failed to delete role");
      }
    });
  };

  return (
     <>
    {isPending && <FullPageLoader />}
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete role</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {" "}
            <span className="font-medium">{role.length}</span> Role?
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
    </>
  );
}
