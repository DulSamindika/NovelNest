// src/app/login/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Header from "@/components/site/header";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mobileFromReg = searchParams.get("mobileNumber");
    if (mobileFromReg) setMobileNumber(mobileFromReg);
    try { localStorage.removeItem("demo_user"); } catch {}
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { loginCheckAction } = await import("../ideamart-actions");
      const res = await loginCheckAction(mobileNumber, password);
      if (!res.ok) {
        toast({ variant: "destructive", title: "Login failed", description: res.error || "Try again." });
        return;
      }

      try {
        localStorage.setItem("demo_user", JSON.stringify(res.user));
      } catch {}

      router.push("/profile");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login error", description: err?.message || "Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your mobile number below to login to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" type="tel" placeholder="+94XXXXXXXXX" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} disabled={isLoading} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account? <Link href="/register" className="underline">Sign up</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
