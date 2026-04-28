import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Password reset is a mock screen in Phase 1. Real email flow ships in Phase 2.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-11 w-full inline-flex items-center justify-center gap-2",
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
