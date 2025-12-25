import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Check,
  CheckCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Utensils,
  XCircle,
} from "lucide-react";
import type { Recipe } from "../api";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export const renderListView = (recipes: Recipe[], setRowAction: any) => (
  <div className="grid gap-4">
    {recipes.map((recipe) => (
      <Card
        key={recipe.id}
        className="group overflow-hidden transition hover:shadow-md py-0"
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* 1. Image - Fixed aspect ratio and width on desktop */}
            <div className="relative aspect-video w-full sm:w-44 shrink-0 overflow-hidden rounded-md border bg-muted">
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Utensils className="h-8 w-8 opacity-20" />
                </div>
              )}
            </div>

            {/* 2. Content Container */}
            <div className="flex flex-1 flex-col min-w-0">
              {/* Header: Name and Action Icon (Tight layout, no extra gaps) */}
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold leading-none truncate pr-2">
                  {recipe.name}
                </h3>
                
                <div className="-mt-1.5 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setRowAction({ row: { original: recipe }, variant: "update" })}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                        {!recipe.is_approved && (
                              <DropdownMenuItem
                                onSelect={() => setRowAction({ row:{ original: recipe }, variant: "approve" })}
                              >
                                 <Check className="mr-2 h-4 w-4" />
                                Approve
                    </DropdownMenuItem>
                    )}
                      <DropdownMenuItem onClick={() => setRowAction({ row: { original: recipe }, variant: "delete" })} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Description: Immediately under name with small top margin */}
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {recipe.description || "No description provided."}
              </p>

              {/* Footer: Badges (Left) and Dates (Right) */}
              <div className="mt-auto pt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2 h-5">
                    {recipe.diet_type}
                  </Badge>

                  <Badge
                    variant={recipe.is_approved ? "default" : "secondary"}
                    className="text-[10px] uppercase tracking-wider py-0 px-2 h-5 flex items-center"
                  >
                    {recipe.is_approved ? (
                      <CheckCircle className="mr-1 size-3" />
                    ) : (
                      <XCircle className="mr-1 size-3" />
                    )}
                    {recipe.is_approved ? "Approved" : "Pending"}
                  </Badge>
                </div>

                {/* Dates: Single line with gap */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground whitespace-nowrap lg:text-right">
                  <span>
                    <span className="font-medium">Created:</span> {new Date(recipe.created_at).toLocaleDateString()}
                  </span>
                  <span className="hidden sm:inline opacity-30">|</span>
                  <span>
                    <span className="font-medium">Updated:</span> {new Date(recipe.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);