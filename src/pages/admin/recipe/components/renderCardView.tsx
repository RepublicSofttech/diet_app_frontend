import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Utensils,
  CheckCircle2,
  Clock,
  Check,
  Eye,
} from "lucide-react";
import type { Recipe } from "../api";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export const renderCardView = (recipes: Recipe[], setRowAction: any, onViewDetails:any) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {recipes.map((recipe) => (
      <Card
        key={recipe.id}
        className="group flex flex-col overflow-hidden transition-all hover:shadow-lg border-muted/60"
      >
        {/* 1. Image Section with Overlay Badge */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
              <Utensils className="h-10 w-10" />
            </div>
          )}
          
          {/* Status Badge Overlay */}
          <div className="absolute left-2 top-2">
            <Badge 
              variant={recipe.is_approved ? "default" : "secondary"} 
              className="shadow-sm backdrop-blur-md "
            >
              {recipe.is_approved ? (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              ) : (
                <Clock className="mr-1 h-3 w-3" />
              )}
              {recipe.is_approved ? "Approved" : "Pending"}
            </Badge>
          </div>
        </div>

        {/* 2. Content Section */}
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              {/* Diet Type */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80">
                {recipe.diet_type}
              </span>
              {/* Name - Max 1 line */}
              <h3 className="line-clamp-1 text-lg font-bold leading-tight tracking-tight">
                {recipe.name}
              </h3>
            </div>

            {/* Actions Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuItem
                  onClick={() =>{onViewDetails(recipe.id)}
                    
                  }
                >
                  <Eye className="mr-2 h-4 w-4" /> View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setRowAction({ row: { original: recipe }, variant: "update" })
                  }
                >
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
                    <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() =>
                    setRowAction({ row: { original: recipe }, variant: "delete" })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description - Max 2 or 3 lines */}
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {recipe.description || "No description provided."}
          </p>

          {/* 3. Footer Section */}
          <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-muted/50 mt-4">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Created</span>
              <span className="font-medium text-foreground/70">
                {new Date(recipe.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Last Updated</span>
              <span className="font-medium text-foreground/70">
                {new Date(recipe.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);