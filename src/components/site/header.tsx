"use client";

import { BookOpen } from 'lucide-react';
import AuthButton from './auth-button';
import AddBookDialog from './add-book-dialog';
import { useState } from 'react';
import type { Book } from '@/lib/types';

type HeaderProps = {
  addBook: (book: Omit<Book, 'id' | 'sellerId' | 'sellerName'>) => void;
};

export default function Header({ addBook }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline">BiblioSwap</span>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn && <AddBookDialog addBook={addBook} />}
          <AuthButton isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
      </div>
    </header>
  );
}
