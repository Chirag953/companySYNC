"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLogo } from "@/components/shared/AppLogo";
import { DemoCredentials } from "@/components/auth/demo-credentials";
import { useAuth } from "@/lib/auth-context";

const loginSchema = z.object({
  email: z.string().min(1, "Enter your work email").email("Use a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [showPw, setShowPw] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@company.com",
      password: "password",
    },
    mode: "onTouched",
  });

  async function onSubmit(data: LoginValues) {
    await new Promise((r) => setTimeout(r, 380));
    const res = login(data.email, data.password);
    if (!res.ok) {
      toast.error(res.error ?? "Login failed");
      return;
    }
    toast.success("Signed in");
    router.push("/dashboard");
  }

  const stagger = reduce ? 0 : 0.065;
  const dur = reduce ? 0 : 0.38;

  return (
    <div className="relative flex min-h-[100dvh] flex-1 flex-col justify-center px-5 py-10 sm:px-8 md:min-h-0 md:px-10 lg:px-14">
      <motion.div
        className="mx-auto flex w-full max-w-[440px] flex-col gap-8"
        initial={false}
      >
        <motion.div
          className="flex flex-col items-center md:items-start"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex flex-col items-center md:hidden">
            <AppLogo size={52} priority />
            <h1 className="mt-4 text-center font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              companySYNC
            </h1>
          </div>
          <p className="hidden font-heading text-sm font-semibold tracking-tight text-muted-foreground md:block">
            Sign in
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            delay: reduce ? 0 : 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Card
            className={cn(
              "w-full rounded-3xl border-border/50 bg-card/90 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-card/[0.97]",
              "ring-1 ring-black/[0.04] dark:ring-white/10",
              "premium-shadow",
            )}
          >
            <CardHeader className="space-y-2 pb-2 text-center sm:text-left">
              <CardTitle className="font-heading text-2xl tracking-tight sm:text-[1.65rem]">
                Welcome back
              </CardTitle>
              <CardDescription className="text-[0.95rem] leading-relaxed">
                Sign in securely with your company credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-1">
              <div className="md:hidden">
                <DemoCredentials variant="light" />
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                aria-busy={isSubmitting}
                noValidate
              >
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dur, delay: reduce ? 0 : stagger * 1, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2"
                >
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="username"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "login-email-error" : undefined}
                    className={cn(
                      "min-h-11 rounded-xl transition-[box-shadow,transform] duration-200",
                      "focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]",
                      errors.email && "border-destructive",
                    )}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p id="login-email-error" className="text-sm text-destructive" role="alert">
                      {errors.email.message}
                    </p>
                  ) : null}
                </motion.div>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dur, delay: reduce ? 0 : stagger * 2, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2"
                >
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "login-password-error" : undefined}
                    className={cn(
                      "min-h-11 rounded-xl transition-[box-shadow,transform] duration-200",
                      "focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]",
                      errors.password && "border-destructive",
                    )}
                    {...register("password")}
                  />
                  {errors.password ? (
                    <p id="login-password-error" className="text-sm text-destructive" role="alert">
                      {errors.password.message}
                    </p>
                  ) : null}
                </motion.div>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dur, delay: reduce ? 0 : stagger * 3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-wrap items-center justify-between gap-3"
                >
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox checked={showPw} onCheckedChange={(v) => setShowPw(v === true)} />
                    Show password
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox defaultChecked />
                    Remember me
                  </label>
                </motion.div>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dur, delay: reduce ? 0 : stagger * 4, ease: [0.22, 1, 0.36, 1] }}
                  className="pt-1"
                >
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isSubmitting}
                    className={cn(
                      "h-11 min-h-11 w-full gap-2 rounded-xl font-semibold shadow-md",
                      "transition-[transform,box-shadow] duration-200",
                      "hover:shadow-lg",
                      "active:scale-[0.99]",
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Signing in…
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </motion.div>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dur, delay: reduce ? 0 : stagger * 5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link
                    href="/forgot-password"
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "h-auto min-h-10 justify-start px-0 py-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground sm:justify-center",
                    )}
                  >
                    Forgot password?
                  </Link>
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "h-auto min-h-10 justify-end px-0 py-1 text-sm font-medium text-primary underline-offset-4 hover:underline sm:text-right",
                    )}
                  >
                    Create account
                  </Link>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground md:text-left">
          By signing in you agree to internal workforce data handling policies (Phase 1 mock).
        </p>
      </motion.div>
    </div>
  );
}
