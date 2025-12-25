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

import { recipesApi } from "@/shared/api/recipe.api";
import { categoriesApi } from "@/shared/api/category.api";

const DIET_TYPES = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Non-Vegetarian", value: "non-vegetarian" },
  { label: "Vegan", value: "vegan" },
] as const;

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  diet_type: z.enum(["vegetarian", "non-vegetarian", "vegan"]),
  category: z.string().nonempty("Category is required"),
  images: z.array(z.instanceof(File)).nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRecipeSheetProps {
  onSuccess?: () => void;
}

export function CreateRecipeSheet({ onSuccess }: CreateRecipeSheetProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [categories, setCategories] = React.useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      diet_type: "vegetarian",
      category: "",
      images: null,
    },
  });

  // Fetch Categories
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

  async function onSubmit(data: FormValues) {
    startTransition(async () => {
      try {
        // 1. Create the recipe first
        const createPayload = {
          name: data.name,
          description: data.description,
          diet_type: data.diet_type,
          category: parseInt(data.category),
        };

        const newRecipe = await recipesApi.create(createPayload);

        // 2. If there's an image, upload it to the new ID
        if (data.images && data.images.length > 0 && newRecipe?.id) {
          const formData = new FormData();
          // Using "image_url" as per your Swagger requirements
          formData.append("image_url", data.images[0]);
          
          await recipesApi.uploadImage(newRecipe.id, formData);
        }

        toast.success("Recipe created successfully");
        form.reset();
        setOpen(false);
        onSuccess?.();
      } catch (error: any) {
        console.error(error);
        toast.error(error?.response?.data?.detail || "Failed to create recipe.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Recipe
        </Button>
      </DialogTrigger>

      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()}
        className="md:max-w-[60%] p-0 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* --- STICKY HEADER --- */}
        <div className="sticky top-0 z-10 p-6 border-b bg-background">
          <DialogHeader>
            <DialogTitle>Create Recipe</DialogTitle>
            <DialogDescription>Fill in the details to add a new recipe to your collection.</DialogDescription>
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
                              <p className="text-sm font-medium">Click or drag to upload image</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG up to 4MB</p>
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
                                 <p className="text-xs text-green-600 font-semibold">Image ready for upload</p>
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                ) : (
                  "Create Recipe"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}