"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor, // Added for better mobile support
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Save,
  Trash2,
  Pencil,
  ChevronDown,
  Image as ImageIcon,
  Ellipsis,
  Check,
  Search,
  Hash,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { recipeStepsApi } from "@/shared/api/recipe-steps.api";
import { StepFormDialog, type StepDialogHandle } from "./StepFormDialog";

type StatusFilter = "all" | "approved" | "pending";

export interface Step {
  id: string;
  instruction: string;
  step_number: number;
  image_url?: string;
  is_approved: boolean;
}

interface StepsTabProps {
  recipeId: string;
  steps: Step[];
  onAdd: (description: string) => Promise<void>;
  onUpdate: (stepId: string, payload: Partial<Step>) => Promise<void>;
  onUpload: (stepId: string, file: File) => Promise<void>;
  onDelete: (stepId: string) => Promise<void>;
  onReorder: React.Dispatch<React.SetStateAction<Step[]>>;
  loading?: boolean;
}

export function StepsTab({
  steps: initialSteps,
  onAdd,
  onUpdate,
  onUpload,
  onDelete,
  onReorder,
  loading = false,
}: StepsTabProps) {
  const [localSteps, setLocalSteps] = React.useState<Step[]>([]);
  const [isOrderChanged, setIsOrderChanged] = React.useState(false);
  const [isSavingOrder, setIsSavingOrder] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [stepNumber, setStepNumber] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");

  const dialogRef = React.useRef<StepDialogHandle>(null);
  
  // Added TouchSensor with activation constraint to prevent drag-vs-scroll conflicts
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  React.useEffect(() => {
    setLocalSteps(initialSteps);
  }, [initialSteps]);

  const filteredSteps = React.useMemo(() => {
    let steps = [...localSteps];
    if (search.trim()) {
      const q = search.toLowerCase();
      steps = steps.filter((s) => s.instruction.toLowerCase().includes(q));
    }
    if (stepNumber) {
      const num = Number(stepNumber);
      if (!Number.isNaN(num)) steps = steps.filter((s) => s.step_number === num);
    }
    if (status === "approved") steps = steps.filter((s) => s.is_approved);
    if (status === "pending") steps = steps.filter((s) => !s.is_approved);
    return steps;
  }, [localSteps, search, stepNumber, status]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localSteps.findIndex((s) => s.id === active.id);
    const newIndex = localSteps.findIndex((s) => s.id === over.id);

    const reordered = arrayMove(localSteps, oldIndex, newIndex).map((s, idx) => ({
      ...s,
      step_number: idx + 1,
    }));

    setLocalSteps(reordered);
    setIsOrderChanged(true);
    onReorder(reordered);
  };

  const saveOrdering = async () => {
    setIsSavingOrder(true);
    try {
      await Promise.all(
        localSteps.map((s) => recipeStepsApi.patch(s.id, { step_number: s.step_number }))
      );
      setIsOrderChanged(false);
      toast.success("Cooking sequence updated");
    } catch {
      toast.error("Failed to save order");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDialogSubmit = async (values: any, id?: string) => {
    const { images, ...payload } = values;
    try {
      if (id) {
        await onUpdate(id, payload);
        if (images?.length) await onUpload(id, images[0]);
      } else {
        await onAdd(payload.instruction);
      }
      toast.success(id ? "Step updated" : "Step added");
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <Card className="p-4 md:p-6 space-y-4">
        <div className="flex justify-between"><Skeleton className="h-8 w-1/3" /><Skeleton className="h-8 w-24" /></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden border-none sm:border shadow-none sm:shadow-sm">
        {/* ---------- HEADER: Responsive stacking ---------- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-5 sm:px-6 border-b bg-background gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Cooking Sequence</h1>
            <p className="text-sm text-muted-foreground">Manage and reorder steps.</p>
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            {isOrderChanged && (
              <Button variant="outline" size="sm" onClick={saveOrdering} disabled={isSavingOrder} className="flex-1 sm:flex-none border-primary/30 text-primary">
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            )}
            <Button size="sm" onClick={() => dialogRef.current?.open()} className="flex-1 sm:flex-none">
              <Plus className="mr-2 h-4 w-4" /> Add Step
            </Button>
          </div>
        </div>

        {/* ---------- FILTERS: Stackable inputs ---------- */}
        <div className="px-4 py-4 sm:px-6 border-b bg-muted/20 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search instructions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-lg bg-background w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-24 sm:w-28">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Step"
                value={stepNumber}
                onChange={(e) => setStepNumber(e.target.value)}
                className="pl-9 h-9 rounded-lg bg-background"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2 flex-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden xs:inline">{status === 'all' ? 'Status' : status}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setStatus("all")}>All Steps</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus("approved")}>Approved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus("pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(search || status !== "all" || stepNumber) && (
              <Button variant="ghost" size="icon" onClick={() => { setSearch(""); setStatus("all"); setStepNumber(""); }} className="h-9 w-9">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* ---------- CONTENT ---------- */}
        <div className="px-2 py-4 sm:px-6">
          {filteredSteps.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={localSteps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {filteredSteps.map((step) => (
                    <AccordionSortableStep
                      key={step.id}
                      step={step}
                      isExpanded={expandedId === step.id}
                      onToggle={() => setExpandedId(expandedId === step.id ? null : step.id)}
                      onEdit={() => dialogRef.current?.open(step)}
                      onDelete={() => onDelete(step.id)}
                      onApprove={() => recipeStepsApi.approve(step.id, { is_approved: true })}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
              <Search className="mx-auto h-8 w-8 opacity-20 mb-2" />
              <p className="text-sm">No steps found</p>
            </div>
          )}
        </div>
      </Card>

      <StepFormDialog ref={dialogRef} onSubmit={handleDialogSubmit} />
    </>
  );
}

function AccordionSortableStep({ step, isExpanded, onToggle, onEdit, onDelete, onApprove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 0 };

  return (
    <div ref={setNodeRef} style={style} className={cn("group relative", isDragging && "z-50")}>
      <div className={cn(
        "rounded-xl border bg-card transition-all",
        isDragging ? "shadow-lg border-primary" : "hover:border-primary/30",
        isExpanded && "border-primary/20"
      )}>
        <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4">
          <div {...attributes} {...listeners} className="cursor-grab p-1.5 text-muted-foreground/40 touch-none">
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex flex-1 items-center gap-3 cursor-pointer min-w-0" onClick={onToggle}>
            <div className="h-10 w-10 shrink-0 rounded-lg border bg-muted overflow-hidden flex items-center justify-center">
              {step.image_url ? <img src={step.image_url} className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4 opacity-20" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase text-primary bg-primary/5 px-2 py-0.5 rounded shrink-0">Step {step.step_number}</span>
                {!step.is_approved && (
                  <Badge variant="outline" className="h-4 text-[9px] bg-yellow-50 text-yellow-600 shrink-0">Pending</Badge>
                )}
              </div>
              <p className={cn("text-sm font-medium truncate", isExpanded ? "text-primary" : "text-foreground")}>{step.instruction}</p>
            </div>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><Ellipsis className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onEdit}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
              {!step.is_approved && <DropdownMenuItem onClick={onApprove}><Check className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>}
              <DropdownMenuSeparator /><DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isExpanded && (
          // CHANGED: px-14 reduced to pl-10 pr-4 on mobile
          <div className="pl-12 pr-4 sm:px-14 pb-4 animate-in fade-in slide-in-from-top-1">
            <div className="p-3 sm:p-4 rounded-xl bg-muted/30 border border-muted-foreground/10 space-y-4">
               {step.image_url && (
                <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden border">
                   <img src={step.image_url} className="w-full h-full object-cover" />
                </div>
               )}
               <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{step.instruction}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}