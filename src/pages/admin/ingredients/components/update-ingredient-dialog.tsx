"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CloudUpload, Loader2, X } from "lucide-react";
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
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FileUploader, FileInput } from "@/shared/components/ui/file-upload";

import type { IngredientUI } from "../api";
import { ingredientsApi } from "@/shared/api/ingredients.api";
import { FullPageLoader } from "@/shared/components/spinner/FullPageLoader";

// 1. Define strict schema - ensuring all types match your IngredientUI and API expectations
const ingredientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  calories: z.string().nullable().optional(),
  protein: z.string().nullable().optional(),
  carbs: z.string().nullable().optional(),
  fat: z.string().nullable().optional(),
  is_vegan: z.boolean(),
  is_non_vegetarian: z.boolean(),
  is_approved: z.boolean(),
  images: z.array(z.instanceof(File)).nullable().optional(),
});

// 2. Extract type from schema
type IngredientFormValues = z.infer<typeof ingredientFormSchema>;

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
  const [isPending, startTransition] = React.useTransition();

  // 3. Initialize form with explicit type to avoid TS "Control mismatch" errors
  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      is_vegan: false,
      is_non_vegetarian: false,
      is_approved: false,
      images: null,
    },
  });

  // 4. Sync form with ingredient data when dialog opens
  React.useEffect(() => {
    if (ingredient && open) {
      form.reset({
        name: ingredient.name,
        calories: ingredient.calories || "",
        protein: ingredient.protein || "",
        carbs: ingredient.carbs || "",
        fat: ingredient.fat || "",
        is_vegan: !!ingredient.is_vegan,
        is_non_vegetarian: !!ingredient.is_non_vegetarian,
        is_approved: !!ingredient.is_approved,
        images: null,
      });
    }
  }, [ingredient, open, form]);

  // 5. Submit handler with 2-step process (Data Update -> Image Upload)
  async function onSubmit(data: IngredientFormValues) {
    if (!ingredient) return;

    startTransition(async () => {
      try {
        const { images, ...metadata } = data;

        // Step 1: Update text/boolean data
        await ingredientsApi.update(ingredient.id, metadata);

        // Step 2: Handle image upload if a new file was selected
        if (data.images && data.images.length > 0) {
          const formData = new FormData();
          // Use the key expected by your backend (e.g., "image_url" or "file")
          formData.append("image_url", data.images[0]);
          await ingredientsApi.uploadImage(ingredient.id, formData);
        }

        toast.success("Ingredient updated successfully");
        onOpenChange(false);
        onSuccess?.();
      } catch (error: any) {
        console.error("Update failed:", error);
        toast.error(error?.response?.data?.detail || "Failed to update ingredient.");
      }
    });
  }

  return (
     <>
    {isPending && <FullPageLoader />}
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()}
        className="md:max-w-[60%] p-0 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* --- STICKY HEADER --- */}
        <div className="sticky top-0 z-10 p-6 border-b bg-background">
          <DialogHeader>
            <DialogTitle>Update Ingredient</DialogTitle>
            <DialogDescription>Modify details and nutritional data for {ingredient?.name}.</DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            
            {/* --- SCROLLABLE BODY --- */}
            <div className="overflow-y-auto px-6 py-6 flex-1 space-y-6">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="E.g. Broccoli" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload Component */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredient Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <FileUploader
                          value={field.value ?? null}
                          onValueChange={field.onChange}
                          dropzoneOptions={{
                            maxFiles: 1,
                            multiple: false,
                            maxSize: 1024 * 1024 * 10,
                            accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }
                          }}
                        >
                          {!field.value?.length ? (
                            <FileInput className="border-2 border-dashed border-muted-foreground/20 hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col items-center justify-center py-8">
                                <CloudUpload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-xs font-medium text-muted-foreground">Click to upload new image</p>
                              </div>
                            </FileInput>
                          ) : (
                            <div className="relative rounded-lg border p-2 bg-accent/50">
                               <div className="flex items-center gap-4">
                                 <img 
                                   src={URL.createObjectURL(field.value[0])} 
                                   alt="Preview" 
                                   className="h-16 w-16 rounded-md object-cover border"
                                 />
                                 <div className="flex-1 overflow-hidden">
                                   <p className="text-sm font-medium truncate">{field.value[0].name}</p>
                                   <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Selected</p>
                                 </div>
                                 <Button 
                                   type="button" 
                                   variant="ghost" 
                                   size="icon" 
                                   onClick={() => field.onChange(null)}
                                 >
                                   <X className="h-4 w-4" />
                                 </Button>
                               </div>
                            </div>
                          )}
                        </FileUploader>

                        {ingredient?.image_url && !field.value?.length && (
                          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                            <img 
                              src={ingredient.image_url} 
                              alt="Current" 
                              className="h-10 w-10 rounded object-cover border" 
                            />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Image</p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nutrition Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories</FormLabel>
                      <FormControl><Input placeholder="0" {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl><Input placeholder="0" {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbs (g)</FormLabel>
                      <FormControl><Input placeholder="0" {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fat (g)</FormLabel>
                      <FormControl><Input placeholder="0" {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Toggles / Checkboxes */}
              <div className="flex flex-wrap gap-6 p-4 border rounded-lg bg-muted/5">
                <FormField
                  control={form.control}
                  name="is_vegan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked === true) form.setValue("is_non_vegetarian", false);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-medium cursor-pointer">Is Vegan</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_non_vegetarian"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked === true) form.setValue("is_vegan", false);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-medium cursor-pointer">Non-Vegetarian</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_approved"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-medium cursor-pointer">Approved</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* --- STICKY FOOTER --- */}
            <DialogFooter className="sticky bottom-0 z-10 p-6 border-t bg-background">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-30">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}