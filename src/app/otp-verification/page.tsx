
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { verifyOtpAndRegisterUserAction } from '../ideamart-actions';
import { Loader2 } from 'lucide-react';

export default function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    mobileNumber: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    const mobileNumber = searchParams.get('mobileNumber');
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');

    if (mobileNumber && firstName && lastName) {
      setUserData({ mobileNumber, firstName, lastName });
    } else {
        // If data is missing, redirect back to register
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Registration details are missing. Please start over.',
        });
        router.push('/register');
    }
  }, [searchParams, router, toast]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await verifyOtpAndRegisterUserAction(userData, otp);

    if (result.success) {
      toast({
        title: 'Account Created!',
        description: 'You can now log in with your mobile number.',
      });

      // After successful registration, navigate to the login page,
      // passing the mobile number for convenience.
      const query = new URLSearchParams({
          mobileNumber: userData.mobileNumber,
      }).toString();

      router.push(`/login?${query}`);
    } else {
       toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: result.error || 'An unexpected error occurred.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">OTP Verification</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {userData.mobileNumber}.
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
