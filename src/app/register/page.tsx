"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { sendOtpAction } from "../ideamart-actions";
import { Loader2 } from "lucide-react";
import Header from "@/components/site/header";

interface FormData {
  firstName: string;
  lastName: string;
  mobileNumber: string; // E.164 preferred
  password: string;     // demo only
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await sendOtpAction(formData.mobileNumber, formData.password);
      if (!res?.success) throw new Error( "Failed to send OTP");

      toast({ title: "OTP sent!", description: "We sent a verification code to your mobile." });

      const query = new URLSearchParams({
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: formData.mobileNumber,
      }).toString();

      router.push(`/otp-verification?${query}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Registration failed", description: error?.message || "Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Enter your information to create an account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" required onChange={handleChange} value={formData.firstName} disabled={isLoading} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" required onChange={handleChange} value={formData.lastName} disabled={isLoading} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" type="tel" placeholder="+94XXXXXXXXX" required onChange={handleChange} value={formData.mobileNumber} disabled={isLoading} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required onChange={handleChange} value={formData.password} disabled={isLoading} />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create an account
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Already have an account? <Link href="/login" className="underline">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
