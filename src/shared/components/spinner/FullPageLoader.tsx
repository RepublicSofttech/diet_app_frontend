export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-white px-7 py-6 shadow-lg">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-md border-4 border-primary/20" />
          <div className="absolute inset-2 animate-[spin_1.5s_linear_infinite_reverse] rounded-sm border-4 border-primary" />
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          Please wait…
        </span>
      </div>
    </div>
  );
}
