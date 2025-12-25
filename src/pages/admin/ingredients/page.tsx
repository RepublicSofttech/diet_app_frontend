import { Shell } from "@/shared/components/ui/shell";
import { IngredientsTable } from "./components/ingredients-table-controller";
import { FeatureFlagsProvider } from "../categories/components/feature-flags-provider";
export default function IngredientsPage() {
  return (
    <Shell>
        <FeatureFlagsProvider>
          <IngredientsTable />
        </FeatureFlagsProvider>
    </Shell>
  );
}