"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import type { Category } from "../api";
import { updateCategory } from "../api";
import type { UpdateCategorySchema } from "../lib/validations";
import { updateCategorySchema } from "../lib/validations";

interface UpdateCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess?: () => void;
}

export function UpdateCategorySheet({
  open,
  onOpenChange,
  category,
  onSuccess,
}: UpdateCategorySheetProps) {
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<UpdateCategorySchema>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
      });
    }
  }, [category, form]);

  async function onSubmit(input: UpdateCategorySchema) {
    if (!category) return;

    setIsPending(true);

    try {
      await updateCategory(category.id, input);
      toast.success("Category updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            Update the category details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter category name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter category description"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                {isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
