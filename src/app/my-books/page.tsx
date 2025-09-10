
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/site/header';
import BookList from '@/components/site/book-list';
import { getLoggedInUser } from '@/lib/data';
import type { User } from '@/lib/types';
import { useBooks } from '@/context/book-context';

export default function MyBooksPage() {
  const [user, setUser] = useState<User | null>(null);
  const { books, toggleFavorite } = useBooks();

  useEffect(() => {
    setUser(getLoggedInUser());
  }, []);

  if (!user) {
    // Optional: Render a loading state
    return <div>Loading...</div>;
  }
  
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
