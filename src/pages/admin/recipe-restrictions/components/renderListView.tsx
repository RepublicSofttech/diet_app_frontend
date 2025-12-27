import { Badge } from "@/shared/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Check, CheckCircle, MoreHorizontal, Pencil, Trash2, Salad, XCircle } from "lucide-react";
import type { IngredientUI } from "../api";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export const renderIngredientListView = (ingredients: IngredientUI[], setRowAction: any) => (
  <div className="grid gap-4">
    {ingredients.map((item) => (
      <Card key={item.id} className="group overflow-hidden transition hover:shadow-md py-0">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-4 sm:flex-row items-center">
            
            {/* 1. Image - Square Thumbnail */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground/30"><Salad className="h-8 w-8" /></div>
              )}
            </div>

            {/* 2. Content Container */}
            <div className="flex flex-1 flex-col min-w-0 h-full">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold leading-none truncate pr-2">{item.name}</h3>
                  {/* Calories Label right under name */}
                  <p className="mt-1 text-xs font-bold text-orange-600">{item.calories} Calories</p>
                </div>
                
                <div className="-mt-1 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setRowAction({ row: { original: item }, variant: "update" })}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      {!item.is_approved && (
                        <DropdownMenuItem onSelect={() => setRowAction({ row: { original: item }, variant: "approve" })}><Check className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                      )}
                        <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => setRowAction({ row: { original: item }, variant: "delete" })} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Middle Section: Clear Nutrition Data */}
              <div className="mt-2 flex gap-4 text-[11px] font-medium text-muted-foreground">
                 <span>Protein: <b className="text-foreground">{item.protein}g</b></span>
                 <span className="opacity-20">|</span>
                 <span>Carbs: <b className="text-foreground">{item.carbs}g</b></span>
                 <span className="opacity-20">|</span>
                 <span>Fat: <b className="text-foreground">{item.fat}g</b></span>
              </div>

              {/* Footer: Badges (Left) and Date (Right) */}
              <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {/* Vegan/Non-Veg Badge */}
                  {item.is_vegan && <Badge variant="outline" className="text-[10px] uppercase border-green-200 text-green-700 bg-green-50 h-5 px-2">Vegan</Badge>}
                  {item.is_non_vegetarian && <Badge variant="outline" className="text-[10px] uppercase border-red-200 text-red-700 bg-red-50 h-5 px-2">Non-Veg</Badge>}

                  {/* Status Badge */}
                  <Badge variant={item.is_approved ? "default" : "secondary"} className="text-[10px] uppercase h-5 flex items-center px-2">
                    {item.is_approved ? <CheckCircle className="mr-1 size-3" /> : <XCircle className="mr-1 size-3" />}
                    {item.is_approved ? "Approved" : "Pending"}
                  </Badge>
                </div>

                <div className="text-[11px] text-muted-foreground lg:text-right">
                  <span className="font-medium">Created:</span> {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);