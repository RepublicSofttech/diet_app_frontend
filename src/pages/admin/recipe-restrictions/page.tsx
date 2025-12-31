import { Shell } from "@/shared/components/ui/shell";
import { FeatureFlagsProvider } from "../categories/components/feature-flags-provider";
import { HealthRecipeMappingTable } from "./components/recipe-restriction-table-controller";
export default function RecipeRestrictionPage() {
  return (
    <Shell>
        <FeatureFlagsProvider>
          <HealthRecipeMappingTable />
        </FeatureFlagsProvider>
    </Shell>
  );
}