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
} from 'lucide-react';

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
};

export default function BookCard({ book }: BookCardProps) {
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
      <CardHeader className="pb-2">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md mb-4">
          <Image
            src={book.bookImageUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={dataAiHintMap[book.genre] || 'book cover'}
          />
        </div>
        <CardTitle className="font-headline text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {GenreIcon}
          <span>{book.genre}</span>
        </div>
        <Badge variant={conditionVariant[book.condition]}>{conditionText[book.condition]}</Badge>
        <p className="text-sm text-foreground/80 line-clamp-3">{book.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 bg-muted/50 p-4">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-primary">${book.sellingPrice.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground line-through">${book.originalPrice.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Contact className="h-4 w-4" />
          <span>{book.sellerName} | {book.sellerContact}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
