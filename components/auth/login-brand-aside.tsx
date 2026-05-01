"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, SquareKanban } from "lucide-react";
import { AppLogo } from "@/components/shared/AppLogo";
import { DemoCredentials } from "@/components/auth/demo-credentials";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: SquareKanban,
    title: "Tasks & workflows",
    body: "See priorities and ownership in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Built for your roles",
    body: "Admin, manager, and employee experiences stay aligned.",
  },
] as const;

export function LoginBrandAside() {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "relative hidden flex-1 flex-col justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/92 to-secondary",
        "p-10 pb-12 text-primary-foreground md:flex md:min-h-0",
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[15%] size-[min(28rem,85vw)] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 right-[-12%] size-[min(24rem,70vw)] rounded-full bg-cyan-400/22 blur-3xl dark:bg-cyan-500/16" />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-lg flex-col gap-10"
        initial={reduce ? false : { opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: reduce ? 0 : 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div>
          <AppLogo size={52} priority />
          <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white md:mt-8 md:text-5xl lg:text-6xl">
            companySYNC
          </h1>
          <h2 className="mt-4 font-heading text-2xl font-bold leading-[1.2] tracking-tight text-white md:text-3xl">
            Workforce tools,
            <span className="block text-white/95">one calm workspace.</span>
          </h2>
          <p className="mt-4 max-w-md text-base text-primary-foreground/85">
            Tasks, attendance, leave, and documents — aligned for teams who ship.
          </p>
        </div>

        <div className="grid max-w-md gap-3">
          {highlights.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce ? 0 : 0.12 + i * 0.08,
                duration: reduce ? 0 : 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-2xl border border-white/15 bg-black/22 p-4 backdrop-blur-xl dark:bg-black/32"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 dark:bg-white/5">
                  <Icon className="size-5 text-white" aria-hidden />
                </span>
                <div>
                  <p className="font-medium text-white">{title}</p>
                  <p className="mt-1 text-sm text-primary-foreground/78">{body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduce ? 0 : 0.32,
            duration: reduce ? 0 : 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <DemoCredentials variant="dark" />
        </motion.div>
      </motion.div>
    </div>
  );
}
