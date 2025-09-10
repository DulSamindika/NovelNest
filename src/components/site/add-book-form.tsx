
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
import { Wand2, Loader2, Upload } from 'lucide-react';
import type { Book } from '@/lib/types';
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z
  .any()
  .refine((files) => files?.length === 1, "Image is required.")
  .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    ".jpg, .jpeg, .png and .webp files are accepted."
  );

const multiFileSchema = z
  .any()
  .refine((files) => files?.length >= 1, "At least one image is required.")
  .refine((files) => Array.from(files).every((file: any) => file.size <= MAX_FILE_SIZE), `Max file size for each image is 5MB.`)
  .refine(
    (files) => Array.from(files).every((file: any) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
    "Only .jpg, .jpeg, .png and .webp files are accepted."
  );

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  author: z.string().min(2, 'Author must be at least 2 characters.'),
  genre: z.string().min(2, 'Genre must be at least 2 characters.'),
  condition: z.enum(['new', 'used-good', 'used-fair']),
  originalPrice: z.coerce.number().positive('Price must be a positive number.'),
  sellingPrice: z.coerce.number().positive('Price must be a positive number.'),
  sellerContact: z.string().min(5, 'Contact info is required.'),
  coverImage: fileSchema,
  otherImages: multiFileSchema,
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

type AddBookFormProps = {
  onFormSubmit: (values: Omit<Book, 'id' | 'sellerId' | 'sellerName' | 'seller'>) => void;
};

export function AddBookForm({ onFormSubmit }: AddBookFormProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [otherImagesPreview, setOtherImagesPreview] = useState<string[]>([]);

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
      coverImage: undefined,
      otherImages: undefined,
      description: '',
    },
  });

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setOtherImagesPreview(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setOtherImagesPreview([]);
    }
  };

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

  const convertFilesToDataUrls = (files: FileList): Promise<string[]> => {
    const promises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });
    return Promise.all(promises);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const coverImageUrl = await convertFilesToDataUrls(values.coverImage);
        const otherImageUrls = await convertFilesToDataUrls(values.otherImages);

        const bookData = {
            title: values.title,
            author: values.author,
            genre: values.genre,
            description: values.description,
            condition: values.condition,
            originalPrice: values.originalPrice,
            sellingPrice: values.sellingPrice,
            sellerContact: values.sellerContact,
            bookImageUrls: [...coverImageUrl, ...otherImageUrls],
        };

        onFormSubmit(bookData);

        toast({
            title: 'Book Listed!',
            description: `"${values.title}" is now available for sale.`,
        });

        form.reset();
        setCoverPreview(null);
        setOtherImagesPreview([]);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Image Upload Failed',
            description: 'There was an error processing your images. Please try again.',
        });
    }
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
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Cover Image (Required)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {coverPreview && (
                    <div className="relative w-20 h-28 rounded-md overflow-hidden">
                      <Image
                        src={coverPreview}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Button type="button" asChild variant="outline">
                    <label htmlFor="cover-upload" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                      <Input
                        id="cover-upload"
                        type="file"
                        className="sr-only"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handleCoverImageChange(e);
                        }}
                      />
                    </label>
                  </Button>
                </div>
              </FormControl>
              <FormDescription>Upload a clear picture of your book's cover.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otherImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images of Book's Condition (Required)</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                    <Button type="button" asChild variant="outline" className="w-fit">
                        <label htmlFor="other-images-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Images
                        <Input
                            id="other-images-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => {
                                field.onChange(e.target.files);
                                handleOtherImagesChange(e);
                            }}
                        />
                        </label>
                    </Button>
                    {otherImagesPreview.length > 0 && (
                        <div className="flex items-center gap-4 flex-wrap">
                            {otherImagesPreview.map((src, index) => (
                                <div key={index} className="relative w-20 h-28 rounded-md overflow-hidden">
                                <Image
                                    src={src}
                                    alt={`Condition preview ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              </FormControl>
              <FormDescription>Upload at least one picture showing the book's condition (e.g., spine, pages).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">List Book</Button>
      </form>
    </Form>
  );
}

    