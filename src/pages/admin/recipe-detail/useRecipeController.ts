import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { recipesApi } from "@/shared/api/recipe.api";
import { recipeIngredientsApi } from "@/shared/api/recipe-ingredients.api";
import { recipeStepsApi } from "@/shared/api/recipe-steps.api";

export function useRecipeController(recipeId: string) {
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------
   * FETCH ALL DATA (INITIAL / FALLBACK)
   * ---------------------------------- */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recipeRes, ingRes, stepsRes] = await Promise.all([
        recipesApi.getById(recipeId),
        recipeIngredientsApi.getByRecipe(recipeId),
        recipeStepsApi.byRecipe(recipeId),
      ]);

      setRecipe(recipeRes);
      setIngredients(ingRes.results);
      setSteps(
        stepsRes.results.sort(
          (a: any, b: any) => a.step_number - b.step_number
        )
      );
    } catch {
      toast.error("Failed to fetch recipe data");
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* -----------------------
   * RECIPE (OPTIMISTIC)
   * ----------------------- */
  const handleUpdateRecipe = async (payload: any) => {
    const previous = recipe;

    setRecipe((prev: any) => (prev ? { ...prev, ...payload } : prev));

    try {
      const updated = await recipesApi.patch(recipeId, payload);
      setRecipe(updated);
      toast.success("Recipe updated");
    } catch {
      setRecipe(previous);
      toast.error("Failed to update recipe");
    }
  };

  /* -----------------------
   * RECIPE IMAGE
   * ----------------------- */
  const handleUploadRecipeImage = async (file: File) => {
    const previous = recipe;
    const previewUrl = URL.createObjectURL(file);

    setRecipe((prev: any) =>
      prev ? { ...prev, image_url: previewUrl } : prev
    );

    const formData = new FormData();
    formData.append("image_url", file);

    try {
      const updated = await recipesApi.uploadImage(recipeId, formData);
      setRecipe(updated);
      URL.revokeObjectURL(previewUrl);
      toast.success("Image updated");
    } catch {
      URL.revokeObjectURL(previewUrl);
      setRecipe(previous);
      toast.error("Image upload failed");
    }
  };



  

   const handleAddIngredient = async (payload: any) => {
  try {
    const created = await recipeIngredientsApi.create({ ...payload, recipe: recipeId });
    setIngredients((prev) => [...prev, created]);
    toast.success("Ingredient added");
  } catch (error) {
    toast.error("Failed to add");
  }
};

const handleUpdateIngredient = async (id: string | number, payload: any) => {
  try {
    // We only send quantity_grams and ingredient ID as per your requirement
    const updated = await recipeIngredientsApi.create(payload);
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
    toast.success("Quantity updated");
  } catch (error) {
    toast.error("Failed to update");
  }
};

const handleDeleteIngredient = async (id: string | number) => {
  // 1. Save current state for rollback
  const previous = [...ingredients];
  
  // 2. Optimistically remove from UI
  setIngredients((prev) => prev.filter((item) => item.id !== id));
  
  try {
    await recipeIngredientsApi.delete(id);
    toast.success("Ingredient removed from recipe");
  } catch (error) {
    // 3. Rollback on failure
    setIngredients(previous);
    toast.error("Failed to remove ingredient");
  }
};

const handleApproveIngredient = async (id: string | number) => {
  // 1. Save current state for rollback
  const previous = [...ingredients];
  
  // 2. Optimistically update UI
  setIngredients((prev) => 
    prev.map((item) => item.id === id ? { ...item, is_approved: true } : item)
  );

  try {
    // Calling the POST /approve/ endpoint as per your API structure
    await recipeIngredientsApi.approve(id, {}); 
    toast.success("Ingredient approved");
  } catch (error) {
    // 3. Rollback on failure
    setIngredients(previous);
    toast.error("Failed to approve ingredient");
  }
};


  /* -----------------------
   * STEPS (OPTIMISTIC + SAFE)
   * ----------------------- */
  const handleAddStep = async (description: string) => {
    const nextStepNumber = steps.length + 1;

    const tempStep = {
      id: `temp-${Date.now()}`,
      recipe: recipeId,
      description,
      step_number: nextStepNumber,
    };

    setSteps((prev) => [...prev, tempStep]);

    try {
      const created = await recipeStepsApi.create({
        recipe: recipeId,
        description,
        step_number: nextStepNumber,
      });

      // Replace temp step with backend step
      setSteps((prev) =>
        prev.map((s) => (s.id === tempStep.id ? created : s))
      );
    } catch {
      setSteps((prev) => prev.filter((s) => s.id !== tempStep.id));
      toast.error("Failed to add step");
    }
  };

  const handleUpdateStep = async (stepId: string, payload: any) => {
    const previous = steps;

    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, ...payload } : s))
    );

    try {
      await recipeStepsApi.patch(stepId, payload);
    } catch {
      setSteps(previous);
      toast.error("Failed to update step");
    }
  };

  const handleUploadStepImage = async (stepId: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);

    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, image_url: previewUrl } : s
      )
    );

    const formData = new FormData();
    formData.append("image", file);

    try {
      await recipeStepsApi.uploadImage(stepId, formData);
      URL.revokeObjectURL(previewUrl);
      fetchData();
    } catch {
      URL.revokeObjectURL(previewUrl);
      toast.error("Failed to upload step image");
      fetchData();
    }
  };

  const handleDeleteStep = async (id: string) => {
    const previous = steps;
    setSteps((prev) => prev.filter((s) => s.id !== id));

    try {
      await recipeStepsApi.delete(id);
    } catch {
      setSteps(previous);
      toast.error("Failed to delete step");
    }
  };

  /* -----------------------
   * EXPORT
   * ----------------------- */
  return {
    recipe,
    ingredients,
    steps,
    loading,

    handleUpdateRecipe,
    handleUploadRecipeImage,

    handleAddIngredient,
    handleUpdateIngredient,
    handleDeleteIngredient,
    handleApproveIngredient,

    handleAddStep,
    handleUpdateStep,
    handleUploadStepImage,
    handleDeleteStep,

    fetchData,
    setSteps,
  };
}
