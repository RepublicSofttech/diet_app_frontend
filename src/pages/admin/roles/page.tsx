import { Shell } from "@/shared/components/ui/shell";
import { FeatureFlagsProvider } from "../roles/components/feature-flags-provider";
import { RoleTable } from "../roles/components/role-table-controller";

export default function RolePage() {
  return (
    <Shell>
      <FeatureFlagsProvider>
        <RoleTable />
      </FeatureFlagsProvider>
    </Shell>
  );   
}