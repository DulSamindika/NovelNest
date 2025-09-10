import BookCard from './book-card';
import type { Book } from '@/lib/types';

type BookListProps = {
  books: Book[];
};

export default function BookList({ books }: BookListProps) {
  if (books.length === 0) {
    return <p className="text-center text-muted-foreground">No books found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
