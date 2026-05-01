import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AppLogo } from "@/components/shared/AppLogo";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-6 p-6">
      <AppLogo size={52} priority />
      <Card className="w-full max-w-md rounded-2xl border-border/60 shadow-lg premium-shadow">
        <CardHeader className="text-center sm:text-left">
          <CardTitle className="font-heading text-xl">Create account</CardTitle>
          <CardDescription>
            Self-service signup is not available in Phase&nbsp;1. Use demo accounts on the sign-in page, or contact your
            administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-11 w-full inline-flex items-center justify-center gap-2 rounded-xl",
            )}
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
