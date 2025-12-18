import { Button } from "@/shared/components/ui/button";
import { ShieldAlert} from "lucide-react";
import ErrorLayout from "./ErrorLayout";




export default function UnauthorizedPage() {
  return (
    <ErrorLayout
      icon={ShieldAlert}
      title="401 – Unauthorized"
      description="You need to be signed in to access this page."
      actions={
        <>
          <Button asChild>
            <a href="/login">Sign in</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/">Home</a>
          </Button>
        </>
      }
    />
  );
}



