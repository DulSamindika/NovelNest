import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { AddBookForm } from './add-book-form';
import { useState } from 'react';

export default function AddBookDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Sell a Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>List a New Book</DialogTitle>
          <DialogDescription>
            Fill in the details below to put your book up for sale. Use the AI
            generator for a captivating description!
          </DialogDescription>
        </DialogHeader>
        <AddBookForm onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
