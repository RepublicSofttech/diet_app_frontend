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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { FileUploader, FileInput } from "@/shared/components/ui/file-upload";

import type { Recipe } from "../api";
import { recipesApi } from "@/shared/api/recipe.api";
import { categoriesApi } from "@/shared/api/category.api";

interface UpdateRecipeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
  onSuccess?: () => void;
}

const DIET_TYPES = [
  { label: "Vegetarian", value: "veg" },
  { label: "Non-Vegetarian", value: "non-veg" },
  { label: "Vegan", value: "vegan" },
] as const;

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  diet_type: z.enum(["veg", "non-veg", "vegan"]),
  category: z.string().nonempty("Category is required"),
  images: z.array(z.instanceof(File)).nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UpdateRecipeSheet({ open, onOpenChange, recipe, onSuccess }: UpdateRecipeSheetProps) {
  const [isPending, startTransition] = React.useTransition();
  const [categories, setCategories] = React.useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      diet_type: "veg",
      category: "",
      images: null,
    },
  });

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await categoriesApi.getCategories({ page: 1, perPage: 100 });
        if (response && response.data) setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }
    if (open) fetchCategories();
  }, [open]);

  React.useEffect(() => {
    if (recipe && open) {
      form.reset({
        name: recipe.name,
        description: recipe.description || "",
        diet_type: (recipe.diet_type as any) || "veg",
        category: recipe.category?.toString() || "",
        images: null,
      });
    }
  }, [recipe, open, form]);

  async function onSubmit(data: FormValues) {
    if (!recipe) return;

    startTransition(async () => {
      try {
        const { images, ...apiPayload } = data;

        // 1. Update basic details
        await recipesApi.update(recipe.id, {
          ...apiPayload,
          category: parseInt(data.category),
        });

        // 2. Upload image if selected
        if (data.images && data.images.length > 0) {
          const formData = new FormData();
          // Match Swagger field name: "image_url"
          formData.append("image_url", data.images[0]); 
          
          await recipesApi.uploadImage(recipe.id, formData);
        }

        toast.success("Recipe updated successfully");
        onOpenChange(false);
        onSuccess?.();
      } catch (error: any) {
        console.error(error);
        toast.error(error?.response?.data?.detail || "Failed to update recipe.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()}
        className="md:max-w-[60%] p-0 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* --- STICKY HEADER --- */}
        <div className="sticky top-0 z-10 p-6 border-b bg-background">
          <DialogHeader>
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogDescription>Modify details for {recipe?.name}.</DialogDescription>
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
                    <FormLabel>Recipe Name</FormLabel>
                    <FormControl><Input placeholder="E.g. Spicy Pasta" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <FileUploader
                          value={field.value ?? null}
                          onValueChange={field.onChange}
                          dropzoneOptions={{
                            maxFiles: 1,
                            multiple: false,
                            maxSize: 1024 * 1024 * 4,
                            accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }
                          }}
                        >
                          {!field.value?.length ? (
                            <FileInput className="border-2 border-dashed border-muted-foreground/20 hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col items-center justify-center py-8">
                                <CloudUpload className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Click or drag to upload new image</p>
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
                                   <p className="text-xs text-green-600 font-semibold">New image selected</p>
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

                        {recipe?.image_url && !field.value?.length && (
                          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                            <img src={recipe.image_url} alt="Current" className="h-12 w-12 rounded object-cover border" />
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Current Image</p>
                              <p className="text-xs text-muted-foreground">This photo is currently active</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="diet_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diet Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Select diet" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {DIET_TYPES.map((diet) => (
                            <SelectItem key={diet.value} value={diet.value}>{diet.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter recipe description..." {...field} className="min-h-[120px] resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* --- STICKY FOOTER --- */}
            <DialogFooter className="sticky bottom-0 z-10 p-6 border-t bg-background">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                ) : (
                  "Update Recipe"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}