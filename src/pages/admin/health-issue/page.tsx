import { Shell } from "@/shared/components/ui/shell";
import { FeatureFlagsProvider } from "./components/feature-flags-provider";
import { HealthIssueTable } from "./components/health-issue-table-controller";

export default function HealthIssuePage() {
  return (
    <Shell>
      <FeatureFlagsProvider>
        <HealthIssueTable />
      </FeatureFlagsProvider>
    </Shell>
  );
}
