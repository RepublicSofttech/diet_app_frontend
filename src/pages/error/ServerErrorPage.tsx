import { ServerCrash } from "lucide-react";
import ErrorLayout from "./ErrorLayout";
import { Button } from "@/shared/components/ui/button";

export default function ServerErrorPage() {
  return (
    <ErrorLayout
      icon={ServerCrash}
      title="500 – Server error"
      description="Something broke on our side. Please try again later."
      actions={
        <>
          <Button onClick={() => location.reload()}>Retry</Button>
          <Button variant="outline" asChild>
            <a href="/">Home</a>
          </Button>
        </>
      }
    />
  );
}