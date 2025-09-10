
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { AddBookForm } from './add-book-form';
import { useState } from 'react';
import type { Book } from '@/lib/types';

type AddBookDialogProps = {
  addBook: (book: Omit<Book, 'id' | 'sellerId' | 'sellerName'>) => void;
};

export default function AddBookDialog({ addBook }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);

  const handleFormSubmit = (values: Omit<Book, 'id' | 'sellerId' | 'sellerName' | 'bookImageUrl'> & { bookImageUrl: string }) => {
    addBook(values);
    setOpen(false);
  };

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
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <AddBookForm onFormSubmit={handleFormSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
