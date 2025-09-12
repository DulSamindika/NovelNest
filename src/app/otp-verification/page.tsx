
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addUser } from '@/lib/data';

export default function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [otp, setOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    // Retrieve user data from query params
    const mobileFromQuery = searchParams.get('mobileNumber');
    const firstNameFromQuery = searchParams.get('firstName');
    const lastNameFromQuery = searchParams.get('lastName');
    if (mobileFromQuery && firstNameFromQuery && lastNameFromQuery) {
      setMobileNumber(mobileFromQuery);
      setFirstName(firstNameFromQuery);
      setLastName(lastNameFromQuery);
    } else {
        // If data is missing, redirect back to register
        router.push('/register');
    }
  }, [searchParams, router]);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    // For simulation, we'll accept any 6-digit code.
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      
      // Add the new user to our simulated database
      addUser({
          firstName: firstName,
          lastName: lastName,
          mobileNumber: mobileNumber,
      });

      // After successful registration, navigate to the login page,
      // passing the new user's data in the query params for simulation.
      const query = new URLSearchParams({
          firstName: firstName,
          lastName: lastName,
          mobileNumber: mobileNumber,
      }).toString();

      router.push(`/login?${query}`);

    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Please enter a valid 6-digit OTP.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">OTP Verification</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your mobile number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOtp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="123456"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Verify Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
