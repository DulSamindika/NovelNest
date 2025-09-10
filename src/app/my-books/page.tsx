
"use client";

import { useState } from 'react';
import Header from '@/components/site/header';
import BookList from '@/components/site/book-list';
import { mockUser, mockBooks } from '@/lib/data';
import type { Book } from '@/lib/types';

export default function MyBooksPage() {
  const [user, setUser] = useState(mockUser);
  const [books, setBooks] = useState(mockBooks.filter(book => book.sellerId === user.uid));

  const addBook = (newBook: Omit<Book, 'id' | 'sellerId' | 'sellerName'>) => {
    const bookToAdd: Book = {
      ...newBook,
      id: (books.length + 1).toString(),
      sellerId: user.uid,
      sellerName: `${user.firstName} ${user.lastName}`,
    };
    setBooks(prevBooks => [bookToAdd, ...prevBooks]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground/90 sm:text-4xl mb-6">
            Your Books for Sale
          </h1>
          <BookList books={books} onToggleFavorite={() => {}} />
        </div>
      </main>
    </div>
  );
}
