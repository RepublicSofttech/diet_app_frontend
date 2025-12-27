"use client";

import { 
  ChevronLeft, 
  Loader2, 
  Utensils, 
  Tag, 
  ClipboardList, 
  ChefHat, 
  Layers,
  Calendar
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/shared/components/ui/breadcrumb";

import { useRecipeController } from "./useRecipeController";
import { GeneralInfoTab } from "./components/GeneralInfoTab";
import { IngredientsTab } from "./components/IngredientsTab";
import { StepsTab } from "./components/StepsTab";
import { Link, useParams } from "react-router-dom";

export default function RecipeDetailPage() {

  const { id } = useParams();
  if(!id)
    return 
  const ctrl = useRecipeController(id);

  if (ctrl.loading) return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading recipe data...</p>
    </div>
  );

  if (!ctrl.recipe) return null;

  return (
    <div className="container py-8 space-y-8 animate-in fade-in duration-500">
      
      {/* ---------- BREADCRUMBS ---------- */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/recipes">Recipes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Recipe Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ---------- HEADER SECTION ---------- */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
                {ctrl.recipe.name}
              </h1>
              <Badge 
                variant={ctrl.recipe.is_approved ? "default" : "outline"}
                className={ctrl.recipe.is_approved 
                  ? "bg-green-500/10 text-green-600 border-green-500/20 px-3" 
                  : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 px-3"
                }
              >
                {ctrl.recipe.is_approved ? "Approved" : "Pending Review"}
              </Badge>
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary/60" />
                <span>{ctrl.recipe.diet_type || "Standard"}</span>
              </div>
              <Separator orientation="vertical" className="hidden sm:block h-4" />
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary/60" />
                <span>Category ID: {ctrl.recipe.category}</span>
              </div>
              <Separator orientation="vertical" className="hidden sm:block h-4" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/60" />
                <span>Last updated {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/recipes">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to List
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- TAB NAVIGATION ---------- */}
      <Tabs defaultValue="general" className="w-full space-y-8">
        <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-muted/50 p-1.5 border w-full sm:w-auto">
          <TabsTrigger value="general" className="rounded-lg px-6 py-2 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ClipboardList className="h-4 w-4" />
            General Info
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="rounded-lg px-6 py-2 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ChefHat className="h-4 w-4" />
            Ingredients
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 min-w-[20px] justify-center bg-muted-foreground/10 text-[10px]">
              {ctrl.ingredients.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="steps" className="rounded-lg px-6 py-2 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Layers className="h-4 w-4" />
            Steps
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 min-w-[20px] justify-center bg-muted-foreground/10 text-[10px]">
              {ctrl.steps.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 transition-all focus-visible:outline-none">
          <TabsContent value="general" className="m-0 outline-none">
            <GeneralInfoTab 
              recipe={ctrl.recipe} 
              onRefresh={ctrl.fetchData} 
            />
          </TabsContent>

          <TabsContent value="ingredients" className="m-0 outline-none">
            <IngredientsTab
              recipeId={id}
              ingredients={ctrl.ingredients}
              onAdd={ctrl.handleAddIngredient}
              onUpdate={ctrl.handleUpdateIngredient}
              onDelete={ctrl.handleDeleteIngredient}
              // onRefresh={ctrl.fetchData}  
              onApprove={ctrl.handleApproveIngredient}  
            />
          </TabsContent>

          <TabsContent value="steps" className="m-0 outline-none">
            <StepsTab
              recipeId={id}
              steps={ctrl.steps}
              onAdd={ctrl.handleAddStep}
              onUpdate={ctrl.handleUpdateStep}
              onUpload={ctrl.handleUploadStepImage}
              onDelete={ctrl.handleDeleteStep}
              onReorder={ctrl.setSteps}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}