"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";

import type { HealthRecipeMappingUI } from "../api";
import { healthRecipeMappingApi } from "@/shared/api/recipe-restriction.api";
/* ------------------------------------------------------------------
 * Schema
 * ------------------------------------------------------------------ */
const updateHealthRecipeMappingSchema = z.object({
  restriction_type: z.enum(["avoid", "recommended"], {
    message: "Restriction type is required",
  }),
});

type UpdateHealthRecipeMappingFormValues = z.infer<
  typeof updateHealthRecipeMappingSchema
>;

interface UpdateHealthRecipeMappingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mapping: any| HealthRecipeMappingUI | null;
  onSuccess?: () => void;
}

/* ------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------ */
export function UpdateHealthRecipeMappingSheet({
  open,
  onOpenChange,
  mapping,
  onSuccess,
}: UpdateHealthRecipeMappingSheetProps) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<UpdateHealthRecipeMappingFormValues>({
    resolver: zodResolver(updateHealthRecipeMappingSchema),
    defaultValues: {
      restriction_type: "avoid",
    },
  });

  /* ------------------------------------------------------------------
   * Sync form with selected mapping
   * ------------------------------------------------------------------ */
  React.useEffect(() => {
    if (mapping && open) {
      form.reset({
        restriction_type: mapping.restriction_type,
      });
    }
  }, [mapping, open, form]);

  /* ------------------------------------------------------------------
   * Submit
   * ------------------------------------------------------------------ */
  function onSubmit(data: UpdateHealthRecipeMappingFormValues) {
    if (!mapping) return;
  console.log("data  : " ,data)
    startTransition(async () => {
      try {
        await healthRecipeMappingApi.update(mapping.id, {...mapping, ...data});

        toast.success("Health mapping updated successfully");
        onOpenChange(false);
        onSuccess?.();
      } catch (error: any) {
        console.error("Update failed:", error);
        toast.error(
          error?.response?.data?.detail ||
            "Failed to update health mapping"
        );
      }
    });
  }
console.log("mapping : "  , mapping)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="md:max-w-120 p-0 flex flex-col max-h-[90vh]"
      >
        {/* ---------------- Header ---------------- */}
        <div className="sticky top-0 z-10 p-6 border-b bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-muted-foreground" />
              Update Health Restriction
            </DialogTitle>
            <DialogDescription>
              Modify how this recipe behaves for a health condition.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* ---------------- Body ---------------- */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Recipe (Read-only) */}
              <div className="space-y-2">
                <FormLabel>Recipe</FormLabel>
                <div className="rounded-md border p-3 bg-muted/30 font-medium">
                  {mapping?.recipe.name? mapping?.recipe.name :mapping?.recipe}
                </div>
              </div>

              {/* Condition (Read-only) */}
              <div className="space-y-2">
                <FormLabel>Health Condition</FormLabel>
                <div className="rounded-md border p-3 bg-muted/30">
                  {mapping?.condition.name ? mapping?.condition.name : mapping?.condition}
                </div>
              </div>

              {/* Restriction Type */}
              <FormField
                control={form.control}
                name="restriction_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restriction Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select restriction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="avoid">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive">Avoid</Badge>
                              <span className="text-sm">
                                Not suitable for this condition
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="recommended">
                            <div className="flex items-center gap-2">
                              <Badge variant="default">Recommended</Badge>
                              <span className="text-sm">
                                Safe or beneficial
                              </span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ---------------- Footer ---------------- */}
            <DialogFooter className="sticky bottom-0 z-10 p-6 border-t bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-32">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Mapping"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
