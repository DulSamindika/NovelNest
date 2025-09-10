
"use client";

import { useState } from 'react';
import Header from '@/components/site/header';
import BookList from '@/components/site/book-list';
import { mockUser } from '@/lib/data';
import { useBooks } from '@/context/book-context';

export default function MyBooksPage() {
  const [user] = useState(mockUser);
  const { books, toggleFavorite } = useBooks();
  const userBooks = books.filter(book => book.sellerId === user.uid);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground/90 sm:text-4xl mb-6">
            Your Books for Sale
          </h1>
          <BookList books={userBooks} onToggleFavorite={toggleFavorite} />
        </div>
      </main>
    </div>
  );
}
