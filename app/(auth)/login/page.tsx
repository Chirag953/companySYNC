"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("password");
  const [showPw, setShowPw] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      toast.error(res.error ?? "Login failed");
      return;
    }
    toast.success("Signed in");
    router.push("/dashboard");
  }

  return (
    <>
      <div className="relative hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary/90 to-primary p-10 text-primary-foreground md:flex">
        <div>
          <p className="text-sm font-semibold tracking-wide">companySYNC</p>
          <h2 className="mt-6 max-w-md text-3xl font-bold leading-tight">
            One workspace for tasks, attendance, leave, and documents.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-primary-foreground/80">
          Phase 1 uses mock data. Try admin@company.com, manager@company.com, or employee@company.com
          with password <code className="rounded bg-black/20 px-1">password</code>.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Use your company email and password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  className="min-h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  className="min-h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={showPw} onCheckedChange={(v) => setShowPw(v === true)} />
                  Show password
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox defaultChecked />
                  Remember me
                </label>
              </div>
              <Button type="submit" className="min-h-11 w-full">
                Sign in
              </Button>
              <Link
                href="/forgot-password"
                className={cn(buttonVariants({ variant: "link" }), "h-auto min-h-11 px-0 py-1")}
              >
                Forgot password?
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
