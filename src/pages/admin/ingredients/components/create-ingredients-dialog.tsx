"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
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
import type { CreateIngredientSchema } from "../lib/validations";
import { createIngredientSchema } from "../lib/validations";
import { ingredientsApi } from "@/shared/api/ingredients.api";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface CreateIngredientSheetProps {
  onSuccess?: () => void;
}

export function CreateIngredientSheet({ onSuccess }: CreateIngredientSheetProps) {
  
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<CreateIngredientSchema>({
    resolver: zodResolver(createIngredientSchema),
     defaultValues: {
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    is_vegan: false,
    is_non_vegetarian: false,
    image_url: null,
  },
  });

  async function onSubmit(input: CreateIngredientSchema) {
    setIsPending(true);

    try {
      await ingredientsApi.create(input);
      toast.success("Ingredient created successfully");
      form.reset();
      setOpen(false);
      onSuccess?.(); // Trigger refetch
    } catch (error) {
      toast.error("Failed to create ingredient");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Ingredient
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Ingredient</DialogTitle>
          <DialogDescription>
            Create a new ingredient for your recipes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <FormLabel>Protein</FormLabel>
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
             </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
            
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}