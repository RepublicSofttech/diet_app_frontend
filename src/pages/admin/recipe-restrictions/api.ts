export interface RecipeMini {
  id: number;
  name: string;
}

export interface ConditionMini {
  id: number;
  name: string;
}

export interface HealthRecipeMappingUI {
  id: number;
  restriction_type: "avoid" | "recommended";
  recipe: RecipeMini;
  condition: ConditionMini;
  created_at: string;
  updated_at: string;
}
