import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Salad, CheckCircle2, Clock, Check } from "lucide-react";
import type { IngredientUI } from "../../ingredients/api";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export const renderIngredientCardView = (ingredients: IngredientUI[], setRowAction: any) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {ingredients.map((item) => (
      <Card key={item.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg border-muted/60">
        
        {/* 1. Image Section (Made smaller: h-32 instead of aspect-video) */}
        <div className="relative h-32 w-full overflow-hidden bg-muted">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30"><Salad className="h-8 w-8" /></div>
          )}
          
          {/* Top Left: Status */}
          <div className="absolute left-2 top-2">
            <Badge variant={item.is_approved ? "default" : "secondary"} className="shadow-sm backdrop-blur-md text-[10px]">
              {item.is_approved ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
              {item.is_approved ? "Approved" : "Pending"}
            </Badge>
          </div>

          {/* Top Right: Diet Type */}
          <div className="absolute right-2 top-2">
            {item.is_vegan && <Badge className="bg-green-600 text-[10px] hover:bg-green-600">Vegan</Badge>}
            {item.is_non_vegetarian && <Badge variant="destructive" className="text-[10px]">Non-Veg</Badge>}
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-base font-bold tracking-tight">{item.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setRowAction({ row: { original: item }, variant: "update" })}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                {!item.is_approved && (
                  <DropdownMenuItem onSelect={() => setRowAction({ row: { original: item }, variant: "approve" })}><Check className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                )}
                            <DropdownMenuSeparator />

                <DropdownMenuItem className="text-destructive" onClick={() => setRowAction({ row: { original: item }, variant: "delete" })}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 2. Nutrition Stats (Center Section) */}
          <div className="mt-3 grid grid-cols-3 gap-1 border-y border-muted/50 py-3">
             <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Prot</p>
                <p className="text-xs font-semibold">{item.protein}g</p>
             </div>
             <div className="text-center border-x">
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Carb</p>
                <p className="text-xs font-semibold">{item.carbs}g</p>
             </div>
             <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Fat</p>
                <p className="text-xs font-semibold">{item.fat}g</p>
             </div>
          </div>

          {/* 3. Footer: Calories & Dates */}
          <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
             <span className="font-bold text-orange-600">{item.calories} kcal</span>
             <span>{new Date(item.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);