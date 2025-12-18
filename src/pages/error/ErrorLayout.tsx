import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export default function ErrorLayout({ icon: Icon, title, description, actions }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; actions: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex gap-2">{actions}</div>
        </CardContent>
      </Card>
    </div>
  );
}
