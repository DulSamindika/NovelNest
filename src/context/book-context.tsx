
"use client";

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Book } from '@/lib/types';
import { mockBooks, getLoggedInUser } from '@/lib/data';

type BookContextType = {
  books: Book[];
  addBook: (newBook: Omit<Book, 'id' | 'sellerId' | 'sellerName'>) => void;
  toggleFavorite: (bookId: string) => void;
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(mockBooks);

  const addBook = (newBook: Omit<Book, 'id' | 'sellerId' | 'sellerName'>) => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        // In a real app, you might want to redirect to login or show an error
        console.error("No user logged in to add a book.");
        return;
    }

    const bookToAdd: Book = {
      ...newBook,
      id: (books.length + 1).toString(),
      sellerId: loggedInUser.uid,
      sellerName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
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
