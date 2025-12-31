"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ShieldAlert, Loader2, Plus } from "lucide-react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";

import { healthRecipeMappingApi } from "@/shared/api/recipe-restriction.api";
import { recipesApi } from "@/shared/api/recipe.api";
import { healthIssueApi } from "@/shared/api/health-issue.api";

/* ------------------------------------------------------------------
 * Schema
 * ------------------------------------------------------------------ */
const createHealthMappingSchema = z.object({
  recipe_id: z.string().nonempty("Recipe is required"),
  condition_id: z.string().nonempty("Condition is required"),
  restriction_type: z.enum(["avoid", "recommended"], {
    message: "Restriction type is required",
  }),
});
type CreateHealthMappingValues = z.infer<typeof createHealthMappingSchema>;


export function CreateHealthMappingSheet({ onSuccess }: any) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<CreateHealthMappingValues>({
    resolver: zodResolver(createHealthMappingSchema),
    defaultValues: {
      recipe_id: "",
      condition_id: "",
      restriction_type: "avoid",
    },
  });

  const [recipes, setRecipes] = React.useState<{ id: number; name: string }[]>([]);
  const [conditions, setConditions] = React.useState<{ id: number; name: string }[]>([]);
  const [loadingData, setLoadingData] = React.useState(false);

  /* ------------------------------------------------------------------
   * Fetch recipes + health conditions
   * ------------------------------------------------------------------ */
  React.useEffect(() => {
    if (!open) return;

    setLoadingData(true);
    (async () => {
      try {
        const [recipeRes, conditionRes] = await Promise.all([
          recipesApi.get?.({ page: 1, perPage: 1000 }) ?? { data: [] },
          healthIssueApi.get?.({ page: 1, perPage: 1000 }) ?? { data: [] },
        ]);

        setRecipes(recipeRes.data ?? []);
        setConditions(conditionRes.data ?? []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load recipes or health conditions");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [open]);

  /* ------------------------------------------------------------------
   * Submit
   * ------------------------------------------------------------------ */
  async function onSubmit(data: CreateHealthMappingValues) {
    startTransition(async () => {
      try {
        await healthRecipeMappingApi.create({
          recipe: parseInt(data.recipe_id, 10),
          condition: parseInt(data.condition_id, 10),
          restriction_type: data.restriction_type,
        });

        toast.success("Health mapping created successfully");
        form.reset();
        setOpen(false);
        onSuccess?.();
      } catch (error: any) {
        console.error("Creation failed:", error);
        toast.error(error?.response?.data?.detail || "Failed to create health mapping.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Health Mapping
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="md:max-w-[480px] p-0 flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="sticky top-0 z-10 p-6 border-b bg-background">
          <DialogHeader>
            <DialogTitle>
              <ShieldAlert className="h-5 w-5 text-muted-foreground mr-2 inline-block" />
              Add Health Mapping
            </DialogTitle>
            <DialogDescription>
              Link a recipe with a health condition and set its restriction.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto px-6 py-6 flex-1 space-y-6">
              {loadingData ? (
                <div className="text-center py-12">
                  <Loader2 className="animate-spin mx-auto h-6 w-6" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
                </div>
              ) : (
                <>
                  {/* Recipe */}
                  <FormField
                    control={form.control}
                    name="recipe_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipe</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select recipe" />
                            </SelectTrigger>
                            <SelectContent>
                              {recipes.map((r) => (
                                <SelectItem key={r.id} value={r.id.toString()}>
                                  {r.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Health Condition */}
                  <FormField
                    control={form.control}
                    name="condition_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Condition</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditions.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Restriction Type */}
                  <FormField
                    control={form.control}
                    name="restriction_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restriction Type</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select restriction" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="avoid">Avoid</SelectItem>
                              <SelectItem value="recommended">Recommended</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <DialogFooter className="sticky bottom-0 z-10 p-6 border-t bg-background">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              {!loadingData && (
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Mapping"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
