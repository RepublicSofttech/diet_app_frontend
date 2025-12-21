// Dummy API functions for categories
// This file contains mock implementations for development and testing

export interface HealthIssue {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  approved_by: string | null;
}
