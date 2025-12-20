import { Shell } from "@/shared/components/ui/shell";
import { FeatureFlagsProvider } from "./components/feature-flags-provider";
import { CategoriesTable } from "./components/categories-table-controller";

export default function CategoriesPage() {
  return (
    <Shell>
      <FeatureFlagsProvider>
        <CategoriesTable />
      </FeatureFlagsProvider>
    </Shell>
  );
}
