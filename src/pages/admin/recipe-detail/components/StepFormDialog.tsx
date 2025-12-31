"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CloudUpload, Loader2, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { FileUploader, FileInput } from "@/shared/components/ui/file-upload";

const stepSchema = z.object({
  instruction: z.string().min(5, "Instruction must be at least 5 characters"),
  images: z.array(z.instanceof(File)).nullable().optional(),
});

type StepFormValues = z.infer<typeof stepSchema>;

export interface StepDialogHandle {
  open: (data?: any) => void;
}

interface StepFormDialogProps {
  onSubmit: (data: StepFormValues, id?: string) => Promise<void>;
}

export const StepFormDialog = React.forwardRef<StepDialogHandle, StepFormDialogProps>(
  ({ onSubmit }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | undefined>();
    const [isPending, setIsPending] = React.useState(false);

    const form = useForm<StepFormValues>({
      resolver: zodResolver(stepSchema),
      defaultValues: { instruction: "", images: null },
    });

    React.useImperativeHandle(ref, () => ({
      open: (data?: any) => {
        if (data) {
          setEditingId(data.id);
          form.reset({ instruction: data.instruction, images: null });
        } else {
          setEditingId(undefined);
          form.reset({ instruction: "", images: null });
        }
        setIsOpen(true);
      },
    }));

    const handleInternalSubmit = async (values: StepFormValues) => {
      setIsPending(true);
      try {
        await onSubmit(values, editingId);
        setIsOpen(false);
      } finally {
        setIsPending(false);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
       <DialogContent className="w-full max-w-full sm:max-w-lg p-0 flex flex-col max-h-[90vh] overflow-hidden">

          <div className="p-4 sm:p-6 border-b">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Cooking Step" : "Add New Step"}</DialogTitle>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleInternalSubmit)} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 space-y-6 overflow-y-auto">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step Image (Optional)</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value ?? null}
                          onValueChange={field.onChange}
                          dropzoneOptions={{ maxFiles: 1, accept: { "image/*": [] } }}
                        >
                          {!field.value?.length ? (
                            <FileInput className="border-2 border-dashed py-8">
                              <CloudUpload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm font-medium text-center">Click to upload step photo</p>
                            </FileInput>
                          ) : (
                            <div className="flex items-center gap-4 p-3 border rounded-xl bg-muted/30">
                              <img src={URL.createObjectURL(field.value[0])} className="h-16 w-16 rounded-lg object-cover" />
                              <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold truncate">{field.value[0].name}</p>
                                <p className="text-[10px] text-green-600 font-bold uppercase">Ready</p>
                              </div>
                              <Button type="button" variant="ghost" size="icon" onClick={() => field.onChange(null)}><X className="h-4 w-4"/></Button>
                            </div>
                          )}
                        </FileUploader>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instruction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instruction</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What should the cook do in this step?" 
                          className="min-h-[140px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="p-6 border-t">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending} className="min-w-[120px]">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? "Update Step" : "Create Step")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);