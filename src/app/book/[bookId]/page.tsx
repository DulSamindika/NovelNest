
"use client";

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getBookById } from '@/lib/data';
import type { Book } from '@/lib/types';
import Header from '@/components/site/header';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Tag, Star, Phone } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const conditionText: { [key in Book['condition']]: string } = {
  new: 'New',
  'used-good': 'Used - Good',
  'used-fair': 'Used - Fair',
};

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const [book, setBook] = useState<Book | null | undefined>(undefined);

  useEffect(() => {
    if (bookId) {
      const fetchedBook = getBookById(bookId);
      setBook(fetchedBook);
    }
  }, [bookId]);

  if (book === undefined) {
    return <div>Loading...</div>;
  }

  if (book === null) {
    notFound();
  }
  
  const averageRating = book.seller.ratings.length > 0
  ? (book.seller.ratings.reduce((acc, r) => acc + r.rating, 0) / book.seller.ratings.length).toFixed(1)
  : 'N/A';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  {book.bookImageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <Card className="overflow-hidden">
                          <div className="relative aspect-[2/3] w-full">
                            <Image
                              src={url}
                              alt={`${book.title} image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2" />
                <CarouselNext className="absolute right-2" />
              </Carousel>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold font-headline">{book.title}</h1>
                <p className="text-lg text-muted-foreground">by {book.author}</p>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="secondary">{book.genre}</Badge>
                <Badge variant="outline">{conditionText[book.condition]}</Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-primary">${book.sellingPrice.toFixed(2)}</p>
                <p className="text-lg text-muted-foreground line-through">${book.originalPrice.toFixed(2)}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-foreground/80">{book.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">About the Seller</h3>
                <Link href={`/profile/${book.sellerId}`} className="group">
                  <Card className="p-4 flex items-center gap-4 transition-colors group-hover:bg-muted/50">
                     <Avatar className="h-16 w-16">
                      <AvatarImage src={book.seller.profilePicUrl} alt={book.sellerName} />
                      <AvatarFallback>{book.sellerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{book.sellerName}</p>
                      <div className="flex items-center gap-2 text-sm text-yellow-500 mt-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{averageRating} ({book.seller.ratings.length} ratings)</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>

              <Button size="lg" className="mt-auto">
                <Phone className="mr-2" />
                Contact Seller ({book.sellerContact})
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
