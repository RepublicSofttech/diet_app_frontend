'use client';

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import type { Category } from './data-table-types';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';


interface CategoryDialogProps {
  category?: Category | null; // Pass category for editing, null for adding
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function CategoryDialog({ category, isOpen, onClose, onSave }: CategoryDialogProps) {
  if (!isOpen) return null;

  // This would typically use react-hook-form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        isApproved: formData.get('isApproved') === 'on'
    };
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the category below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={category?.name || ''} required />
           </div>
           <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={category?.description || ''} required/>
           </div>
           <div className="flex items-center gap-2">
                <input type="checkbox" id="isApproved" name="isApproved" defaultChecked={category?.isApproved || false} />
                <Label htmlFor="isApproved">Approved</Label>
            </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}