"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Brand mark in `public/companySYNC-LOGO.png` — wrapper is transparent (no chip / ring). */
export const APP_LOGO_PATH = "/companySYNC-LOGO.png";

type AppLogoProps = {
  /** Square box size in CSS pixels */
  size?: number;
  className?: string;
  /** For first paint (sidebar / login) */
  priority?: boolean;
};

export function AppLogo({ size = 36, className, priority }: AppLogoProps) {
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={APP_LOGO_PATH}
        alt="companySYNC"
        fill
        className="object-contain"
        sizes={`${size}px`}
        priority={priority}
      />
    </span>
  );
}
