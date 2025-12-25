import { Shell } from "@/shared/components/ui/shell";
import { RecipesTable } from "./components/recipe-table-controller";
import { FeatureFlagsProvider } from "./components/feature-flags-provider";

export default function RecipePage() {
  return (
    <Shell>
      <FeatureFlagsProvider>
        <RecipesTable />
        </FeatureFlagsProvider>
    </Shell>
  );
}
