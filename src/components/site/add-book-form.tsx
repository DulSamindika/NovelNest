"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateDescriptionAction } from '@/app/actions';
import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import type { Book } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  author: z.string().min(2, 'Author must be at least 2 characters.'),
  genre: z.string().min(2, 'Genre must be at least 2 characters.'),
  condition: z.enum(['new', 'used-good', 'used-fair']),
  originalPrice: z.coerce.number().positive('Price must be a positive number.'),
  sellingPrice: z.coerce.number().positive('Price must be a positive number.'),
  sellerContact: z.string().min(5, 'Contact info is required.'),
  bookImageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

type AddBookFormProps = {
  onFormSubmit: (values: Omit<Book, 'id' | 'sellerId' | 'sellerName'>) => void;
};

export function AddBookForm({ onFormSubmit }: AddBookFormProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      condition: 'used-good',
      originalPrice: 0,
      sellingPrice: 0,
      sellerContact: '',
      bookImageUrl: '',
      description: '',
    },
  });

  async function handleGenerateDescription() {
    const { title, author, genre } = form.getValues();
    if (!title || !author || !genre) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out Title, Author, and Genre to generate a description.',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateDescriptionAction({ title, author, genre });
      if (result.success && result.description) {
        form.setValue('description', result.description, { shouldValidate: true });
        toast({
          title: 'Success!',
          description: 'A new book description has been generated.',
        });
      } else {
        throw new Error(result.error || 'Failed to generate description.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: (error as Error).message,
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: 'Book Listed!',
      description: `"${values.title}" is now available for sale.`,
    });
    const bookData = {
      ...values,
      bookImageUrl: values.bookImageUrl || 'https://picsum.photos/seed/newbook/400/600',
    };
    onFormSubmit(bookData);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="The Great Gatsby" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="F. Scott Fitzgerald" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="Classic, Sci-Fi, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="relative">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A brief, engaging summary of the book..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateDescription}
            disabled={isGenerating}
            className="absolute bottom-1 right-1"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select book condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used-good">Used - Good</SelectItem>
                    <SelectItem value="used-fair">Used - Fair</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellerContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Info</FormLabel>
                <FormControl>
                  <Input placeholder="Phone or email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="25.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="12.50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="bookImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/book.jpg" {...field} />
              </FormControl>
              <FormDescription>Optional: A link to a photo of your book.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">List Book</Button>
      </form>
    </Form>
  );
}
