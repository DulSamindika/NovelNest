
"use client";

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Book } from '@/lib/types';
import { mockBooks, mockUser } from '@/lib/data';

type BookContextType = {
  books: Book[];
  addBook: (newBook: Omit<Book, 'id' | 'sellerId' | 'sellerName'>) => void;
  toggleFavorite: (bookId: string) => void;
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(mockBooks);

  const addBook = (newBook: Omit<Book, 'id' | 'sellerId' | 'sellerName'>) => {
    const bookToAdd: Book = {
      ...newBook,
      id: (books.length + 1).toString(),
      sellerId: mockUser.uid, // Using mock user for now
      sellerName: `${mockUser.firstName} ${mockUser.lastName}`,
    };
    setBooks(prevBooks => [bookToAdd, ...prevBooks]);
  };

  const toggleFavorite = (bookId: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
      )
    );
  };

  return (
    <BookContext.Provider value={{ books, addBook, toggleFavorite }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}
