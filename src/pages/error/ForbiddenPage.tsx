import { ShieldX } from "lucide-react";
import ErrorLayout from "./ErrorLayout";
import { Button } from "@/shared/ui/button";

export default function ForbiddenPage() {
  return (
    <ErrorLayout
      icon={ShieldX}
      title="403 – Forbidden"
      description="You don’t have permission to view this resource."
      actions={
        <Button variant="outline" asChild>
          <a href="/">Return home</a>
        </Button>
      }
    />
  );
}
