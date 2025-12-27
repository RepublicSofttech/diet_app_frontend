"use client";

import React, { useState, useMemo } from "react";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Check, 
  Plus, 
  Utensils, 
  Search, 
  X 
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Input } from "@/shared/components/ui/input";

import { RecipeIngredientFormDialog } from "./UpdateIngredientDialog";

interface IngredientsTabProps {
  ingredients: any[];
  onDelete: (id: string) => void;
  onUpdate: (data: any) => any;
  onAdd: (data: any) => any;
  onApprove: (id: string) => void;
  recipeId: string;
  loading?: boolean;
}

export function IngredientsTab({
  ingredients = [],
  onDelete,
  onUpdate,
  onAdd,
  recipeId,
  onApprove,
  loading = false,
}: IngredientsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const handleAdd = () => {
    setSelectedIngredient(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedIngredient(item.ingredient);
    setIsDialogOpen(true);
  };

  /* -----------------------
   * FILTER LOGIC
   * ----------------------- */
  const filteredIngredients = useMemo(() => {
    if (!search.trim()) return ingredients;
    const query = search.toLowerCase();
    return ingredients.filter((item) =>
      item.ingredient?.name?.toLowerCase().includes(query)
    );
  }, [ingredients, search]);

  /* -----------------------
   * LOADING STATE
   * ----------------------- */
  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        {/* ---------- HEADER ---------- */}
        <div className="flex items-start justify-between px-6 py-5 border-b bg-background">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Recipe Ingredients</h1>
            <p className="text-sm text-muted-foreground">
              Manage the items required for this recipe.
            </p>
          </div>

          <Button size="sm" onClick={handleAdd} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Ingredient
          </Button>
        </div>

        {/* ---------- FILTER BAR (Consistent with StepsTab) ---------- */}
        <div className="px-6 py-4 border-b bg-muted/20 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ingredient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-lg bg-background"
            />
          </div>
          
          {search && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearch("")}
              className="h-9"
            >
              <X className="mr-2 h-4 w-4" /> Reset
            </Button>
          )}
        </div>

        {/* ---------- CONTENT ---------- */}
        <div className="px-6 py-6">
          {filteredIngredients.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredIngredients.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-base truncate">
                        {item.ingredient?.name || "Unknown Ingredient"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.quantity_grams} grams
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!item.is_approved && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] uppercase tracking-wider"
                      >
                        Pending
                      </Badge>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>

                        {!item.is_approved && (
                          <DropdownMenuItem onClick={() => onApprove(item.id)}>
                            <Check className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ---------- EMPTY STATE ---------- */
            <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                {search ? (
                  <Search className="h-6 w-6 opacity-20" />
                ) : (
                  <Utensils className="h-6 w-6 opacity-20" />
                )}
              </div>
              <p className="font-medium text-foreground">
                {search ? "No matching ingredients" : "No ingredients added"}
              </p>
              <p className="text-sm">
                {search 
                  ? "Try a different search term or clear the filter." 
                  : "Add the first ingredient to start building this recipe."}
              </p>
            </div>
          )}
        </div>
      </Card>

      <RecipeIngredientFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        recipeId={recipeId}
        existingIngredients={ingredients}
        recipeIngredient={selectedIngredient}
        onAdd={onAdd}
        onUpdate={onUpdate}
      />
    </>
  );
}