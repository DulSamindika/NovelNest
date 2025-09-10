
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Book, BookCondition } from '@/lib/types';
import {
  BookText,
  Contact,
  Heart,
  FlaskConical,
  Swords,
  ScrollText,
  Sparkles,
  User,
} from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const genreIcons: { [key: string]: React.ReactNode } = {
  Fantasy: <Swords className="h-4 w-4" />,
  'Sci-Fi': <FlaskConical className="h-4 w-4" />,
  'Historical Fiction': <ScrollText className="h-4 w-4" />,
  Biography: <BookText className="h-4 w-4" />,
  'Self-Help': <Sparkles className="h-4 w-4" />,
  Romance: <Heart className="h-4 w-4" />,
};

const conditionVariant: { [key: BookCondition]: 'default' | 'secondary' | 'outline' } = {
  new: 'default',
  'used-good': 'secondary',
  'used-fair': 'outline',
};

const conditionText: { [key: BookCondition]: string } = {
  new: 'New',
  'used-good': 'Used - Good',
  'used-fair': 'Used - Fair',
};

type BookCardProps = {
  book: Book;
  onToggleFavorite: (bookId: string) => void;
};

export default function BookCard({ book, onToggleFavorite }: BookCardProps) {
  const GenreIcon = genreIcons[book.genre] || <BookText className="h-4 w-4" />;
  
  const dataAiHintMap: Record<string, string> = {
    'Fantasy': 'library fantasy',
    'Sci-Fi': 'space stars',
    'Historical Fiction': 'dust storm',
    'Biography': 'mountain school',
    'Self-Help': 'gears abstract'
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-background/70 rounded-full hover:bg-background"
          onClick={() => onToggleFavorite(book.id)}
        >
          <Heart className={`h-5 w-5 ${book.isFavorite ? 'text-red-500 fill-current' : 'text-foreground/80'}`} />
        </Button>
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            src={book.bookImageUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={dataAiHintMap[book.genre] || 'book cover'}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 p-4">
         <CardTitle className="font-headline text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground -mt-2">{book.author}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {GenreIcon}
          <span>{book.genre}</span>
        </div>
        <Badge variant={conditionVariant[book.condition]}>{conditionText[book.condition]}</Badge>
        <p className="text-sm text-foreground/80 line-clamp-3">{book.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 bg-muted/50 p-4 mt-auto">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-primary">${book.sellingPrice.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground line-through">${book.originalPrice.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <Link href={`/profile/${book.sellerId}`} className="hover:underline">
            <span>{book.sellerName} | {book.sellerContact}</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
