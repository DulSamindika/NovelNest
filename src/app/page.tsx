"use client";

import BookList from '@/components/site/book-list';
import Header from '@/components/site/header';
import { mockBooks } from '@/lib/data';
import type { Book } from '@/lib/types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Home() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');

  const addBook = (newBook: Omit<Book, 'id' | 'sellerId' | 'sellerName'>) => {
    const bookToAdd: Book = {
      ...newBook,
      id: (books.length + 1).toString(),
      sellerId: 'user-123', // Assuming the logged in user is the seller
      sellerName: 'Jane Doe', // Assuming the logged in user is the seller
    };
    setBooks(prevBooks => [bookToAdd, ...prevBooks]);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header addBook={addBook} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground/90 sm:text-4xl">
              Available Books
            </h1>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title or author..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <BookList books={filteredBooks} />
        </div>
      </main>
    </div>
  );
}