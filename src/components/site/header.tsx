
"use client";

import AuthButton from './auth-button';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Logo from './logo';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Simulate checking auth state on mount
  useEffect(() => {
    // This is a simple check. In a real app, you'd verify a token
    // or check a global state management store.
    if (pathname.startsWith('/profile') || pathname === '/my-books') {
        setIsLoggedIn(true);
    } else if (pathname === '/login' || pathname === '/register') {
        setIsLoggedIn(false);
    }
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/my-books', label: 'My Books', loggedIn: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-primary" />
            <span className="font-bold text-lg font-headline">NovelNest</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map(link => 
              (!link.loggedIn || isLoggedIn) && (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <AuthButton isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
      </div>
    </header>
  );
}
