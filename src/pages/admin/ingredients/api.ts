export interface IngredientUI {
 id: number;
  name: string;

  calories: string;
  protein: string;
  carbs: string;
  fat: string;

  is_vegan: boolean;
  is_non_vegetarian: boolean;

  image_url: string | null;

  is_approved: boolean;

  created_at: string;
  updated_at: string;

  created_by: number;
  approved_by: number | null;
}