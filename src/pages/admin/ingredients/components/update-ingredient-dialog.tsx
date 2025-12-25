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
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import type { IngredientUI } from "../api";
import { updateIngredientSchema, type UpdateIngredientSchema } from "../lib/validations";
import { Button } from "@/shared/components/ui/button";
import { ingredientsApi } from "@/shared/api/ingredients.api";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface UpdateIngredientSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: IngredientUI | null;
  onSuccess?: () => void;
}

export function UpdateIngredientSheet({
  open,
  onOpenChange,
  ingredient,
  onSuccess,
}: UpdateIngredientSheetProps) {
  const [isPending, setIsPending] = React.useState(false);

  
const form = useForm<UpdateIngredientSchema>({
  resolver: zodResolver(updateIngredientSchema),
  defaultValues: {
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    is_vegan: false,
    is_non_vegetarian: false,
    image_url: null,
    is_approved: false,
  },
});


useEffect(() => {
  if (ingredient) {
    form.reset({
      name: ingredient.name,
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      is_vegan: ingredient.is_vegan,
      is_non_vegetarian: ingredient.is_non_vegetarian,
      image_url: ingredient.image_url,
      is_approved: ingredient.is_approved,
    });
  }
}, [ingredient, form]);

  async function onSubmit(input: UpdateIngredientSchema) {
    if (!ingredient) return;

    setIsPending(true);

    try {
      await ingredientsApi.update(ingredient?.id, input);
      toast.success("Ingredient updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update ingredient");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[106.25]">
        <DialogHeader>
          <DialogTitle>Update Ingredient</DialogTitle>
          <DialogDescription>
            Update a new ingredient for your recipes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Calories */}
            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter calories" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Protein */}
            <FormField
              control={form.control}
              name="protein"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter protein" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Carbs */}
            <FormField
              control={form.control}
              name="carbs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter carbs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fats */}
            <FormField
              control={form.control}
              name="fat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fat</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter fat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Is Vegan */}
            <FormField
              control={form.control}
              name="is_vegan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked); // user choice
                        if (checked === true) {
                          form.setValue("is_non_vegetarian", false);
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel>Vegan</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Is Non-Vegetarian */}
            <FormField
                control={form.control}
                name="is_non_vegetarian"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked); // user choice
                          if (checked === true) {
                            form.setValue("is_vegan", false);
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel>Non-Vegetarian</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}