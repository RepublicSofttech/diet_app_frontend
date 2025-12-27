"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ingredientsApi } from "@/shared/api/ingredients.api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/shared/components/ui/dialog";

const formSchema = z.object({
  ingredient: z.string().min(1, "Please select an ingredient"),
  quantity_grams: z.string().min(1, "Quantity is required")
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string | number;
  existingIngredients?: any[];
  item?: any; // Replaced recipeIngredient with item for clarity
  onAdd: (data: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
}

export function RecipeIngredientFormDialog({
  open,
  onOpenChange,
  recipeId,
  existingIngredients = [],
  item, 
  onAdd,
  onUpdate
}: Props) {
  const [availableIngredients, setAvailableIngredients] = React.useState<any[]>([]);

  // 1. Precise Edit Mode Detection
  // We are in edit mode if 'item' exists and has a nested 'ingredient' object
  const isEditMode = React.useMemo(() => !!(item && item.ingredient), [item]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredient: "",
      quantity_grams: ""
    }
  });

  // 2. Patch Form on Open
  React.useEffect(() => {
    if (open) {
      if (isEditMode && item) {
        form.reset({
          // Path: item.ingredient.id (ID 6 in your example)
          ingredient: item.ingredient.id.toString(),
          // Path: item.quantity_grams ("60" in your example)
          quantity_grams: item.quantity_grams.toString()
        });
      } else {
        form.reset({
          ingredient: "",
          quantity_grams: ""
        });
      }
    }
  }, [open, isEditMode, item, form]);

  // 3. Fetch ingredients for Add Mode
  React.useEffect(() => {
    if (open && !isEditMode) {
      ingredientsApi.get().then((res) => {
        setAvailableIngredients(res.data || []);
      });
    }
  }, [open, isEditMode]);

  // 4. Determine Dropdown Options
  const selectOptions = React.useMemo(() => {
    if (isEditMode && item?.ingredient) {
      return [item.ingredient];
    }
    // Filter: Show only ingredients NOT already in the recipe
    return availableIngredients.filter(
      (ing) => !existingIngredients.some((ei) => ei.ingredient?.id === ing.id)
    );
  }, [isEditMode, item, availableIngredients, existingIngredients]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      ingredient: Number(data.ingredient),
      quantity_grams: data.quantity_grams,
      recipe: Number(recipeId)
    };

    try {
      if (isEditMode && item) {
        await onUpdate(item.id, payload);
      } else {
        await onAdd(payload);
      }
      onOpenChange(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Quantity" : "Add Ingredient to Recipe"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ingredient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredient</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an ingredient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectOptions.map((ing) => (
                        <SelectItem key={ing.id} value={ing.id.toString()}>
                          {ing.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity_grams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Grams)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Update Quantity" : "Add Ingredient"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}