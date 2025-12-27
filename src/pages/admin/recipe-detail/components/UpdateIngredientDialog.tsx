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
  existingIngredients?: any[]; // The list already in the recipe
  recipeIngredient?: any;     // If present, we are in EDIT mode
  onAdd: (data: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
}

export function RecipeIngredientFormDialog({
  open,
  onOpenChange,
  recipeId,
  existingIngredients = [],
  recipeIngredient,
  onAdd,
  onUpdate
}: Props) {
  const [availableIngredients, setAvailableIngredients] = React.useState<any[]>([]);
  const isEditMode = Boolean(recipeIngredient);
  console.log(recipeIngredient)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredient: "",
      quantity_grams: ""
    }
  });

  // 1. Reset form when dialog opens or mode changes
  React.useEffect(() => {
    if (open) {
      if (isEditMode && recipeIngredient) {
        form.reset({
          ingredient: recipeIngredient.ingredient?.id?.toString() || recipeIngredient.id?.toString(),
          quantity_grams: recipeIngredient.quantity_grams?.toString() || ""
        });
      } else {
        form.reset({
          ingredient: "",
          quantity_grams: ""
        });
      }
    }
  }, [open, isEditMode, recipeIngredient, form]);

  // 2. Fetch all ingredients ONLY for Add Mode
  React.useEffect(() => {
    if (open && !isEditMode) {
      ingredientsApi.get().then((res) => {
        setAvailableIngredients(res.data || []);
      });
    }
  }, [open, isEditMode]);

  // 3. Determine Select Options
  const selectOptions = React.useMemo(() => {
    if (isEditMode) {
      // In edit mode, only show the currently selected ingredient
      const currentIng = recipeIngredient.ingredient || recipeIngredient;
      return [currentIng];
    }

    // In add mode, filter out ingredients already in the recipe
    return availableIngredients.filter(
      (ing) => !existingIngredients.some((ei) => (ei.ingredient?.id || ei.id) === ing.id)
    );
  }, [isEditMode, recipeIngredient, availableIngredients, existingIngredients]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      ingredient: Number(data.ingredient),
      quantity_grams: data.quantity_grams,
      recipe: Number(recipeId)
    };

    try {
      if (isEditMode) {
        await onUpdate(recipeIngredient.id, payload);
      } else {
        await onAdd(payload);
      }
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to save recipe ingredient:", err);
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
            {/* Ingredient Selection */}
            <FormField
              control={form.control}
              name="ingredient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredient</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditMode} // Disable dropdown in edit mode
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

            {/* Quantity Input */}
            <FormField
              control={form.control}
              name="quantity_grams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Grams)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 150" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
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