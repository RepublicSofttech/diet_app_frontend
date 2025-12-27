"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CloudUpload, Loader2, Plus, X } from "lucide-react";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { ingredientsApi } from "@/shared/api/ingredients.api";
import { FullPageLoader } from "@/shared/components/spinner/FullPageLoader";

// 1. Define the creation schema strictly
const createIngredientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  calories: z.string().optional().nullable(),
  protein: z.string().optional().nullable(),
  carbs: z.string().optional().nullable(),
  fat: z.string().optional().nullable(),
  is_vegan: z.boolean(),
  is_non_vegetarian: z.boolean(),
  images: z.array(z.instanceof(File)).nullable().optional(),
});

type CreateIngredientValues = z.infer<typeof createIngredientFormSchema>;

interface CreateIngredientSheetProps {
  onSuccess?: () => void;
}

export function CreateIngredientSheet({ onSuccess }: CreateIngredientSheetProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  // 2. Initialize form with explicit generic to avoid TS errors
  const form = useForm<CreateIngredientValues>({
    resolver: zodResolver(createIngredientFormSchema),
    defaultValues: {
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      is_vegan: false,
      is_non_vegetarian: false,
      images: null,
    },
  });

  // 3. Submission logic: Create Metadata -> Upload Image
  async function onSubmit(data: CreateIngredientValues) {
    startTransition(async () => {
      try {
        const { images, ...metadata } = data;

        // Step 1: Create the ingredient record
        const newIngredient = await ingredientsApi.create(metadata);

        // Step 2: If an image was selected, upload it to the new ID
        if (data.images && data.images.length > 0 && newIngredient?.id) {
          const formData = new FormData();
          // Adjust key to "image_url" as per your backend Swagger docs
          formData.append("image_url", data.images[0]);
          await ingredientsApi.uploadImage(newIngredient.id, formData);
        }

        toast.success("Ingredient created successfully");
        form.reset();
        setOpen(false);
        onSuccess?.();
      } catch (error: any) {
        console.error("Creation failed:", error);
        toast.error(error?.response?.data?.detail || "Failed to create ingredient.");
      }
    });
  }

  return (
        <>
    {isPending && <FullPageLoader />}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Ingredient
        </Button>
      </DialogTrigger>

      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()}
        className="md:max-w-[60%] p-0 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* --- STICKY HEADER --- */}
        <div className="sticky top-0 z-10 p-6 border-b bg-background">
          <DialogHeader>
            <DialogTitle>Add New Ingredient</DialogTitle>
            <DialogDescription>
              Create a new ingredient with nutritional values for your recipes.
            </DialogDescription>
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
                    <FormControl><Input placeholder="E.g. Fresh Spinach" {...field} /></FormControl>
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
                      <FileUploader
                        value={field.value ?? null}
                        onValueChange={field.onChange}
                        dropzoneOptions={{
                          maxFiles: 1,
                          multiple: false,
                          maxSize: 1024 * 1024 * 2,
                          accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }
                        }}
                      >
                        {!field.value?.length ? (
                          <FileInput className="border-2 border-dashed border-muted-foreground/20 hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col items-center justify-center py-8">
                              <CloudUpload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">Click or drag image to upload</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                            </div>
                          </FileInput>
                        ) : (
                          <div className="relative rounded-lg border p-2 bg-accent/50">
                             <div className="flex items-center gap-4">
                               <img 
                                 src={URL.createObjectURL(field.value[0])} 
                                 alt="Preview" 
                                 className="h-20 w-20 rounded-md object-cover border"
                               />
                               <div className="flex-1 overflow-hidden">
                                 <p className="text-sm font-medium truncate">{field.value[0].name}</p>
                                 <p className="text-xs text-green-600 font-bold uppercase">Ready to upload</p>
                               </div>
                               <Button type="button" variant="ghost" size="icon" onClick={() => field.onChange(null)}>
                                 <X className="h-4 w-4" />
                               </Button>
                             </div>
                          </div>
                        )}
                      </FileUploader>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nutritional Grid */}
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

              {/* Type Selection */}
              <div className="flex flex-wrap gap-8 p-4 border rounded-lg bg-muted/5">
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
                      <FormLabel className="cursor-pointer font-medium">Is Vegan</FormLabel>
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
                      <FormLabel className="cursor-pointer font-medium">Non-Vegetarian</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* --- STICKY FOOTER --- */}
            <DialogFooter className="sticky bottom-0 z-10 p-6 border-t bg-background">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
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