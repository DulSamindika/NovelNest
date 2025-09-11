
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { setLoggedInUser, clearLoggedInUser } from '@/lib/data';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Pre-fill email from registration if available
  useEffect(() => {
    const emailFromReg = searchParams.get('email');
    if (emailFromReg) {
      setEmail(emailFromReg);
    }
    // Clear any previously simulated logged-in user on component mount
    clearLoggedInUser();
  }, [searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here.
    console.log('Logging in with:', email, password);

    // For demonstration, we'll simulate a successful login and redirect.
    // If coming from registration, we'll create a temporary user object.
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');

    if (firstName && lastName) {
        setLoggedInUser({
            uid: `user-${Date.now()}`,
            firstName,
            lastName,
            username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
            mobileNumber: 'Not provided',
            contactInfo: email,
            address: 'Not provided',
            profilePicUrl: 'https://picsum.photos/seed/newuser/100/100', // Default pic
            ratings: [],
        });
    } else {
        // Log in with the default user if not coming from registration
        setLoggedInUser(); 
    }
    
    router.push('/profile');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
