import { mockBooks } from '@/lib/data';
import BookCard from './book-card';

export default function BookList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {mockBooks.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
