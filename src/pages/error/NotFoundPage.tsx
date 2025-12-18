import { ArrowLeft, Home, ServerCrash } from "lucide-react";
import ErrorLayout from "./ErrorLayout";
import { Button } from "@/shared/components/ui/button";

export default function NotFoundPage() {
  return (
    <ErrorLayout
      icon={ServerCrash}
      title="404 – Page not found"
      description="This route wandered off the map. The page you’re looking for doesn’t exist."
      actions={
        <>
          <Button asChild>
            <a href="/">
              <Home className="mr-2 h-4 w-4" /> Home
            </a>
          </Button>
          <Button variant="outline" onClick={() => history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back
          </Button>
        </>
      }
    />
  );
}