export interface Recipe {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  diet_type: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  category: number;
  created_by: number;
  approved_by: number | null;
}
