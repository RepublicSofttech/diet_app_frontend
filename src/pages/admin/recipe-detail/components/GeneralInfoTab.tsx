"use client";

import * as React from "react";
import { Pencil, FileText, Image as ImageIcon } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { UpdateRecipeSheet } from "../../recipe/components/update-recipe-dialog";

export interface GeneralInfoTabProps {
  recipe: any;
  loading?: boolean;
  onRefresh?: () => void;
}

export function GeneralInfoTab({
  recipe,
  loading = false,
  onRefresh,
}: GeneralInfoTabProps) {
  const [openEdit, setOpenEdit] = React.useState(false);

  /* -----------------------
   * LOADING STATE
   * ----------------------- */
  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </Card>
    );
  }

  if (!recipe) return null;

  /* -----------------------
   * VIEW
   * ----------------------- */
  return (
    <>
      <Card className="overflow-hidden">
        {/* ---------- HEADER ---------- */}
        <div className="flex items-start justify-between px-6 py-5 border-b bg-background">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Recipe Overview</h1>
            <p className="text-sm text-muted-foreground">
              {recipe.name} {recipe.category_name ? `• ${recipe.category_name}` : ""}
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setOpenEdit(true)}
            className="shrink-0"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        </div>

        {/* ---------- CONTENT ---------- */}
        <div className="px-6 py-6 space-y-8">
          {/* Image Section */}
          {recipe.image_url ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border bg-muted shadow-sm">
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
          ) : !recipe.description ? null : (
            /* If there's a description but no image, we might want a placeholder or just skip */
            <div className="aspect-video w-full rounded-2xl border border-dashed flex flex-col items-center justify-center bg-muted/20 text-muted-foreground">
               <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
               <p className="text-sm">No cover image uploaded</p>
            </div>
          )}

          {/* Description Section */}
          {recipe.description ? (
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase text-primary underline decoration-primary/30 underline-offset-4">
                Description
              </h4>
              <div className="prose prose-sm max-w-none text-foreground/90">
                <p className="whitespace-pre-line leading-relaxed text-base">
                  {recipe.description}
                </p>
              </div>
            </div>
          ) : recipe.image_url ? (
            /* Show "Add description" if image exists but text doesn't */
            <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
              <p className="text-sm">No description provided for this recipe.</p>
            </div>
          ) : null}

          {/* ---------- EMPTY STATE (If both missing) ---------- */}
          {!recipe.image_url && !recipe.description && (
            <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <FileText className="h-6 w-6 opacity-20" />
              </div>
              <p className="font-medium text-foreground">No content yet</p>
              <p className="text-sm">
                Add an image and description to provide more context for this recipe.
              </p>
              <Button 
                variant="link" 
                onClick={() => setOpenEdit(true)}
                className="mt-2 text-primary"
              >
                Add details now
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* ---------- EDIT DIALOG ---------- */}
      <UpdateRecipeSheet
        open={openEdit}
        onOpenChange={setOpenEdit}
        recipe={recipe}
        onSuccess={() => {
          setOpenEdit(false);
          onRefresh?.();
        }}
      />
    </>
  );
}